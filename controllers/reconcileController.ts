import dbConnect from "@/app/lib/dbConnect";
import { findBudget } from "@/helpers/budgetHelpers";
import expenseModel, { Expense } from "@/models/expenseModel";
import incomeModel, { Income } from "@/models/incomeModel";
import { BankTransaction } from "@/types/budget";
import mongoose, { Types } from "mongoose";

async function getTransactionsInRange(
  startDate: Date,
  endDate: Date,
  userId: Types.ObjectId,
  accountId: string,
  pullIncome: boolean,
) {
  await dbConnect();

  const userBudget = await findBudget(userId);

  let incomes: BankTransaction[] = [];

  const expenses = (
    (await expenseModel.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
      budgetId: userBudget._id,
      account: new mongoose.Types.ObjectId(accountId),
    })) as Expense[]
  ).map((expense) => ({
    id: expense._id.toString(),
    date: expense.transactionDate,
    amount: expense.amount,
    description: expense.description,
    type: "expense",
  }));
  if (pullIncome) {
    incomes = (
      (await incomeModel.find({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
        budgetId: userBudget._id,
      })) as Income[]
    ).map((income) => ({
      id: income._id.toString(),
      date: income.date.toString(),
      amount: income.amount,
      description: income.source,
      type: "income",
    }));
  }

  return [...expenses, ...incomes].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

export async function calculateBudgetDelta(
  userId: Types.ObjectId,
  transactions: BankTransaction[],
  accountId: string,
  pullIncome: boolean,
) {
  // Find the earliest and latest dates in the transactions
  const dates = transactions
    .filter((t) => !!t.date)
    .map((t) => new Date(t.date).getTime());
  const earliestDate = new Date(Math.min(...dates));
  const latestDate = new Date(Math.max(...dates));

  const firstMonth = new Date(
    earliestDate.getFullYear(),
    earliestDate.getMonth(),
    1,
  );
  const lastMonth = new Date(
    latestDate.getFullYear(),
    latestDate.getMonth() + 1,
    0,
  );

  // Retrieve the transactions from the first and last months
  const dbTransactions = await getTransactionsInRange(
    firstMonth,
    lastMonth,
    userId,
    accountId,
    pullIncome,
  );

  const matchedTransactions = [];
  const unmatchedTransactions = [];

  for (const bankTransaction of transactions) {
    const match = dbTransactions.find((dbTransaction) => {
      if (dbTransaction.amount !== Math.abs(bankTransaction.amount))
        return false;

      const transactionDate = new Date(dbTransaction.date);
      const bankTransDate = new Date(bankTransaction.date);
      // Compare dates based on mm-dd-yyyy format, ignoring time
      const isSameDate =
        transactionDate.getUTCFullYear() === bankTransDate.getUTCFullYear() &&
        transactionDate.getUTCMonth() === bankTransDate.getUTCMonth() &&
        transactionDate.getUTCDate() === bankTransDate.getUTCDate();

      if (!isSameDate) {
        const oneWeekFromTransactionDate = Date.parse(
          new Date(
            transactionDate.getUTCFullYear(),
            transactionDate.getUTCMonth(),
            transactionDate.getUTCDate() + 7,
          ).toString(),
        );
        const isDateRangeClose =
          oneWeekFromTransactionDate > bankTransDate.getTime() &&
          bankTransDate.getTime() >= transactionDate.getTime();

        if (!isDateRangeClose) return false;
      }

      return true;
    });

    if (match) {
      matchedTransactions.push({ bankTransaction, dbTransaction: match });
      dbTransactions.splice(dbTransactions.indexOf(match), 1); // Remove matched transaction to prevent duplicate matching
    } else {
      unmatchedTransactions.push({
        ...bankTransaction,
        isBankTransaction: true,
      });
    }
  }
  // Push remaining missing dbTransactions to unmatchedTransactions
  for (const remainingDbTransaction of dbTransactions) {
    unmatchedTransactions.push({
      ...remainingDbTransaction,
      isBankTransaction: false,
    });
  }

  return { matchedTransactions, unmatchedTransactions };
}

async function reconcileExpenses(
  ids: string[] | undefined,
  userId: Types.ObjectId,
  budgetId: Types.ObjectId,
) {
  if (!ids) return;
  await expenseModel.updateMany(
    {
      _id: {
        $in: ids,
      },
      budgetId,
    },
    {
      $set: {
        reconciled: new Date(),
        reconciledBy: userId,
      },
    },
  );
}

async function reconcileIncome(
  ids: string[] | undefined,
  userId: Types.ObjectId,
  budgetId: Types.ObjectId,
) {
  if (!ids) return;
  await incomeModel.updateMany(
    {
      _id: {
        $in: ids,
      },
      budgetId,
    },
    {
      $set: {
        reconciled: new Date(),
        reconciledBy: userId,
      },
    },
  );
}

export async function markMatchedTransactionsAsReconciled(
  matchedTransactions: BankTransaction[],
  userId: Types.ObjectId,
) {
  await dbConnect();

  const budget = await findBudget(userId);

  const transactionsByType = new Map<string, string[]>();
  for (const mt of matchedTransactions) {
    if (!mt.id) continue;

    if (transactionsByType.has(mt.type)) {
      transactionsByType.get(mt.type)?.push(mt.id);
    } else {
      transactionsByType.set(mt.type, [mt.id]);
    }
  }

  await reconcileExpenses(
    transactionsByType.get("expense"),
    userId,
    budget._id,
  );

  await reconcileIncome(transactionsByType.get("income"), userId, budget._id);
}
