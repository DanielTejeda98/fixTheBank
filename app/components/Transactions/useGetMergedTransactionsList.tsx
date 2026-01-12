import { ReactElement } from "react";
import ExpenseTransactionCard from "./ExpenseTransactionCard";
import IncomeTransactionCard from "./IcomeTransactionCard";
import { useAppSelector } from "@/redux/store";
import {
  selectAccounts,
  selectCategories,
  selectExpense,
  selectIncome,
  selectTransfers,
} from "@/redux/features/budget-slice";
import TransferTransactionCard from "./TransferTransactionCard";
import { selectSavingsAccounts } from "@/redux/features/savings-slice";

export function useGetMergedTransactionsList() {
  const expenseTransactions = useAppSelector(selectExpense);
  const incomeTransactions = useAppSelector(selectIncome);
  const transferTransactions = useAppSelector(selectTransfers);
  const accounts = useAppSelector(selectAccounts);
  const categories = useAppSelector(selectCategories);
  const savingsAccounts = useAppSelector(selectSavingsAccounts);
  const transactions = [] as {
    date: Date;
    categoryId: string;
    accountId: string;
    transactionCard: ReactElement;
  }[];

  expenseTransactions.forEach((expense) => {
    transactions.push({
      date: expense.transactionDate || expense.date,
      categoryId: expense.category,
      accountId: expense.account,
      transactionCard: (
        <ExpenseTransactionCard
          id={expense._id}
          name={expense.description}
          amount={expense.amount}
          accountName={
            accounts.find((account) => account._id === expense.account)?.name ||
            ""
          }
          categoryName={
            categories.find((category) => category._id === expense.category)
              ?.name || ""
          }
          date={expense.transactionDate || expense.date}
          isBorrowFromNextMonth={expense.borrowFromNextMonth}
          isGiftTransaction={expense.giftTransaction}
          isSplitTransaction={!!expense.splitPaymentMasterId}
          createdById={expense.createdBy._id}
          revealDate={expense.revealGiftDate}
        />
      ),
    });
  });

  incomeTransactions.forEach((income) => {
    transactions.push({
      date: income.date,
      categoryId: "",
      accountId: "",
      transactionCard: (
        <IncomeTransactionCard
          id={income._id}
          name={income.source}
          amount={income.amount}
          date={income.date}
        />
      ),
    });
  });

  transferTransactions.forEach((transfer) => {
    const account = savingsAccounts.find((sa) => sa._id === transfer.account);
    const bucket = account?.buckets.find((bkt) => bkt._id === transfer.bucket);
    transactions.push({
      date: transfer.date,
      categoryId: "",
      accountId: "",
      transactionCard: (
        <TransferTransactionCard
          id={transfer._id}
          name={transfer.name}
          amount={transfer.amount}
          date={transfer.date}
          type={transfer.transactionType}
          account={account?.name}
          bucket={bucket?.name}
        />
      ),
    });
  });

  return transactions;
}
