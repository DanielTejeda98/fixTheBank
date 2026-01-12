// Defines budget logic
import dbConnect from "@/app/lib/dbConnect";
import mongoose, { mongo } from "mongoose";
import budgetModel, { Budget } from "@/models/budgetModel";
import shareableBudgetModel, {
  ShareableBudget,
} from "@/models/shareableBudgets";
import incomeModel, { Income } from "@/models/incomeModel";
import expenseModel, { Expense } from "@/models/expenseModel";
import userModel from "@/models/userModel";
import categoriesModel, { Category } from "@/models/categoriesModel";
import accountModel, { Account } from "@/models/accountModel";
import normalizeMongooseObjects from "@/app/lib/normalizeMongooseObjects";
import savingsModel from "@/models/savingsModel";
import savingsAccountBucket from "@/models/savingsAccountBucket";
import savingsAccount from "@/models/savingsAccount";
import transferModel from "@/models/transferModel";

export async function getUserFullBudgetDocument(
  userId: mongoose.Types.ObjectId,
  budgetMonth: Date
) {
  if (process.env.DEBUG === "debug") {
    console.log(
      `[getUserFullBudgetDocument] Getting full budget document started`
    );
  }
  try {
    await dbConnect();
    const { minDate, maxDate } = getBudgetMinMaxDates(budgetMonth);

    const budget = await budgetModel
      .findOne()
      .or([{ owner: userId }, { allowed: userId }])
      .populate({
        path: "categories",
        model: categoriesModel,
      })
      .populate({
        path: "accounts",
        model: accountModel,
      })
      .populate({
        path: "expenses",
        model: expenseModel,
        match: {
          $or: [
            { date: { $gte: minDate, $lte: maxDate } },
            { transactionDate: { $gte: minDate, $lte: maxDate } },
          ],
        },
        populate: [
          {
            path: "createdBy updatedBy reconciledBy",
            model: userModel,
            select: "username",
          },
        ],
      })
      .populate({
        path: "income",
        model: incomeModel,
        match: { date: { $gte: minDate, $lte: maxDate } },
        populate: [
          {
            path: "createdBy updatedBy reconciledBy",
            model: userModel,
            select: "username",
          },
        ],
      })
      .populate({
        path: "transfers",
        model: transferModel,
        match: { date: { $gte: minDate, $lte: maxDate } },
        populate: [
          {
            path: "createdBy updatedBy",
            model: userModel,
            select: "username",
          },
        ],
      })
      .populate({
        path: "savings",
        model: savingsModel,
        select: "savingsAccounts",
        populate: [
          {
            path: "savingsAccounts",
            model: savingsAccount,
            populate: [
              {
                path: "buckets",
                model: savingsAccountBucket,
              },
            ],
          },
        ],
      })
      .exec();

    if (!budget) {
      return null;
    }
    // Create default account if no accounts exist
    if (!budget.accounts) {
      budget.accounts = new mongoose.Types.Array<Account>();
    }
    if (!budget.accounts.length) {
      const account = await accountModel.create({
        budgetId: budget._id,
        name: "default",
      });

      if (account) {
        budget.accounts.push(account._id);
        budget.save();
      }
    }

    return {
      ...budget._doc,
      minDate: minDate.toLocaleString("en-us", {
        dateStyle: "short",
        timeZone: "UTC",
      }),
      maxDate: maxDate.toLocaleString("en-us", {
        dateStyle: "short",
        timeZone: "UTC",
      }),
      isOwner: budget._doc.owner.toString() === userId.toString(),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export type YearBudgetReviewData = ReturnType<typeof getBudgetForYear>;
export async function getBudgetForYear(
  userId: mongoose.Types.ObjectId,
  year: string
) {
  try {
    await dbConnect();
    const budgetMinDate = new Date(`1/1/${year}`);
    const budgetMaxDate = new Date(`12/31/${year}`);

    const budget = await budgetModel
      .findOne()
      .or([{ owner: userId }, { allowed: userId }])
      .populate({
        path: "categories",
        model: categoriesModel,
      })
      .populate({
        path: "accounts",
        model: accountModel,
      })
      .populate({
        path: "expenses",
        model: expenseModel,
        match: {
          $or: [
            { date: { $gte: budgetMinDate, $lte: budgetMaxDate } },
            { transactionDate: { $gte: budgetMinDate, $lte: budgetMaxDate } },
          ],
        },
        populate: [
          {
            path: "createdBy updatedBy reconciledBy",
            model: userModel,
            select: "username",
          },
        ],
      })
      .populate({
        path: "income",
        model: incomeModel,
        match: { date: { $gte: budgetMinDate, $lte: budgetMaxDate } },
        populate: [
          {
            path: "createdBy updatedBy reconciledBy",
            model: userModel,
            select: "username",
          },
        ],
      })
      .exec();

    if (!budget) {
      return null;
    }

    const oldestBudgetExpense = (await expenseModel
      .findOne({ budgetId: budget._id, date: { $gte: 0 } })
      .sort({ transactionDate: 1, date: 1 })) as Expense;
    const oldestBudgetIncome = (await incomeModel
      .findOne({ budgetId: budget._id, date: { $gte: 0 } })
      .sort({ date: 1 })) as Income;

    const startYear = () => {
      console.log(oldestBudgetExpense, oldestBudgetIncome);
      const oldestExpenseTransaction =
        oldestBudgetExpense.transactionDate || oldestBudgetExpense.date;

      if (oldestBudgetIncome.date > oldestExpenseTransaction) {
        return new Date(oldestExpenseTransaction).getFullYear();
      }

      return new Date(oldestBudgetIncome.date).getFullYear();
    };

    const budgetDoc: Budget = normalizeMongooseObjects(budget._doc);
    const totalExpenses = (budgetDoc.expenses as unknown as Expense[]).reduce(
      (acc: number, curr: Expense) => acc + curr.amount,
      0
    );
    const totalIncome = (budgetDoc.income as unknown as Income[]).reduce(
      (acc: number, curr: Income) => acc + curr.amount,
      0
    );

    const categoryTotalsExpenseBreakdown = (
      budgetDoc.categories as unknown as Category[]
    )
      .map((category) => {
        return {
          id: category._id,
          name: category.name,
          totalExpenses: parseFloat(
            (budgetDoc.expenses as unknown as Expense[])
              .filter((ex) => ex.category === category._id)
              .reduce((acc: number, curr: Expense) => acc + curr.amount, 0)
              .toFixed(2)
          ),
          totalPlanned: parseFloat(
            category.maxMonthExpectedAmount
              .filter(
                (mmea) =>
                  new Date(mmea.month as string).getFullYear() ===
                  parseInt(year)
              )
              .reduce((acc, curr) => (acc += curr.amount as number), 0)
              .toFixed(2)
          ),
        };
      })
      .sort((a, b) => b.totalExpenses - a.totalExpenses);

    const accountTotalsExpenseBreakdown = (
      budgetDoc.accounts as unknown as Account[]
    )
      .map((account) => {
        return {
          id: account._id,
          name: account.name,
          totalExpenses: parseFloat(
            (budgetDoc.expenses as unknown as Expense[])
              .filter((ex) => ex.account === account._id)
              .reduce((acc: number, curr: Expense) => acc + curr.amount, 0)
              .toFixed(2)
          ),
        };
      })
      .sort((a, b) => b.totalExpenses - a.totalExpenses);

    const monthlyExpenseTotalBreakdown = Array.from({ length: 12 }).map(
      (_, index) => {
        console.log(index);
        return parseFloat(
          (budgetDoc.expenses as unknown as Expense[])
            .filter(
              (ex) =>
                (ex.transactionDate
                  ? new Date(ex.transactionDate)
                  : new Date(ex.date)
                ).getMonth() === index
            )
            .reduce((acc: number, curr: Expense) => acc + curr.amount, 0)
            .toFixed(2)
        );
      }
    );

    const monthlyIncomeTotalBreakdown = Array.from({ length: 12 }).map(
      (_, index) => {
        return parseFloat(
          (budgetDoc.income as unknown as Income[])
            .filter((ex) => new Date(ex.date).getMonth() === index)
            .reduce((acc: number, curr: Income) => acc + curr.amount, 0)
            .toFixed(2)
        );
      }
    );

    return {
      ...budgetDoc,
      year,
      startYear: startYear(),
      totalExpenses: parseFloat(totalExpenses.toFixed(2)),
      totalIncome: parseFloat(totalIncome.toFixed(2)),
      balance: parseFloat((totalIncome - totalExpenses).toFixed(2)),
      categoryTotalsExpenseBreakdown,
      accountTotalsExpenseBreakdown,
      monthlyExpenseTotalBreakdown,
      monthlyIncomeTotalBreakdown,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createUserBudget(userId: mongoose.Types.ObjectId) {
  try {
    await dbConnect();

    const budget = await budgetModel.create({
      owner: userId,
    });

    if (!budget) {
      return null;
    }

    const account = await accountModel.create({
      budgetId: budget._id,
      name: "default",
    });

    if (account) {
      budget.accounts.push(account._id);
      budget.save();
    }

    return budget;
  } catch (error) {
    throw error;
  }
}

export async function toggleShareableBudget(userId: mongoose.Types.ObjectId) {
  try {
    await dbConnect();
    // Is the budget being shared?
    const sharedBudgetInfo = await shareableBudgetModel.findOne({
      owner: userId,
    });
    // if budget is not being shared, add it to the sharable budget table and sync budget
    if (!sharedBudgetInfo) {
      return await createSharedBudgetInformation(userId);
    }
    // if budget is being shared, disable share by removing from sharableBudget table and sync budget
    await deleteSharedBudgetInformation(userId, sharedBudgetInfo);
    return false;
  } catch (error) {
    throw error;
  }
}

export async function joinSharedBudget(
  userId: mongoose.Types.ObjectId,
  joinCode: string
) {
  try {
    await dbConnect();

    const sharedBudget = (await shareableBudgetModel.findOne({
      joinCode,
    })) as ShareableBudget;
    if (!sharedBudget) {
      throw new Error(
        "No shared budget with the provided join code: " + joinCode
      );
    }

    if (sharedBudget.requestedAccounts.includes(userId)) {
      throw new Error("Already requested to join budget!");
    }

    sharedBudget.requestedAccounts.push(userId);
    await sharedBudget.save();
  } catch (error) {
    throw error;
  }
}

export async function getBudgetRequesters(
  userId: mongoose.Types.ObjectId,
  budgetId: mongoose.Types.ObjectId
) {
  try {
    await dbConnect();
    const sharedBudget = (await shareableBudgetModel
      .findOne({ owner: userId, budgetId })
      .populate("requestedAccounts", "_id username", userModel)
      .exec()) as ShareableBudget;
    if (!sharedBudget) {
      throw new Error(`No shared budget found for budget ID ${budgetId}`);
    }

    return sharedBudget.requestedAccounts || [];
  } catch (error) {
    throw error;
  }
}

export async function approveRequesterToJoinBudget(
  userId: mongoose.Types.ObjectId,
  budgetId: mongoose.Types.ObjectId,
  requesterId: mongoose.Types.ObjectId
) {
  if (userId === requesterId) {
    throw new Error(
      `Requester ID ${requesterId} is the same as budget owner ID ${userId}`
    );
  }

  try {
    await dbConnect();

    const budget = (await budgetModel.findOne({
      _id: budgetId,
      owner: userId,
    })) as Budget;
    if (!budget) {
      throw new Error(
        `No budget found for user ${userId} with the provided budget Id ${budgetId}`
      );
    }

    const sharedBudget = (await shareableBudgetModel.findOne({
      budgetId,
    })) as ShareableBudget;
    if (!sharedBudget) {
      throw new Error(`No shared budget found for budget ID ${budgetId}`);
    }

    sharedBudget.requestedAccounts.pull(requesterId);
    budget.allowed.push(requesterId);

    await sharedBudget.save();
    await budget.save();
  } catch (error) {
    throw error;
  }
}

export async function addPlannedIncome(
  userId: mongoose.Types.ObjectId,
  monthIndex: string,
  newIncomeStream: { source: string; amount: Number }
) {
  try {
    await dbConnect();
    const budget = await budgetModel
      .findOne()
      .or([{ owner: userId }, { allowed: userId }]);

    if (!budget) {
      throw new Error(`No budget found for user ID: ${userId}`);
    }

    const plannedIncomeMonthList = budget._doc.plannedIncome.find(
      (doc: any) => doc.month === monthIndex
    );
    // If the month index does not exist, create one and push our new source
    if (!plannedIncomeMonthList) {
      budget.plannedIncome.push({
        month: monthIndex,
        incomeStreams: [
          { source: newIncomeStream.source, amount: newIncomeStream.amount },
        ],
      });
    } else {
      plannedIncomeMonthList.incomeStreams.push({
        source: newIncomeStream.source,
        amount: newIncomeStream.amount,
      });
    }

    await budget.save();
  } catch (error) {
    throw error;
  }
}

export async function removePlannedIncome(
  userId: mongoose.Types.ObjectId,
  monthIndex: string,
  incomeSourceId: mongoose.Types.ObjectId
) {
  try {
    await dbConnect();
    const budget = await budgetModel
      .findOne()
      .or([{ owner: userId }, { allowed: userId }]);

    if (!budget) {
      throw new Error(`No budget found for user ID: ${userId}`);
    }

    const plannedIncomeMonthList = budget._doc.plannedIncome.find(
      (doc: any) => doc.month === monthIndex
    );

    // If the month index does not exist, create one and push our new source
    if (!plannedIncomeMonthList) {
      throw new Error("Month index does not exist!");
    }

    plannedIncomeMonthList.pull(incomeSourceId);

    budget.save();
  } catch (error) {
    throw error;
  }
}

export async function getBudgetUsers(userId: mongoose.Types.ObjectId) {
  const budgetUsers = await budgetModel
    .findOne({ owner: userId }, "owner allowed")
    .populate({
      path: "owner",
      model: userModel,
      select: "username email",
    })
    .populate({
      path: "allowed",
      model: userModel,
      select: "username email",
    })
    .exec();

  if (!budgetUsers) {
    throw new Error("No budget found for specified user");
  }

  return budgetUsers;
}

function getBudgetMinMaxDates(budgetMonth: Date) {
  if (process.env.DEBUG === "debug") {
    console.log(
      `[getBudgetMinMaxDates]: Received call with budgetMonth ${budgetMonth}`
    );
  }
  return {
    minDate: new Date(
      Date.UTC(budgetMonth.getFullYear(), budgetMonth.getMonth(), 1, 0, 0, 0, 0)
    ),
    maxDate: new Date(
      Date.UTC(
        budgetMonth.getFullYear(),
        budgetMonth.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      )
    ),
  };
}

async function createSharedBudgetInformation(userId: mongoose.Types.ObjectId) {
  // get budget model assigned to user
  try {
    const budget = await budgetModel.findOne(
      { owner: userId },
      "owner isShared shareId"
    );
    if (!budget) {
      throw new Error("No budget found for specified user");
    }

    const joinCode = generateJoinCode();

    const possibleSharedBudget = await shareableBudgetModel.findOne({
      joinCode: joinCode,
    });
    if (possibleSharedBudget) {
      throw new Error("Unable to process, joinCode was in use.");
    }

    // create sharablebudget document
    const sharableBudgetInfo = await shareableBudgetModel.create({
      owner: userId,
      budgetId: budget._id,
      joinCode: joinCode,
    });

    // sync budget model
    await syncBudgetWithShareableBudgetInfo(budget, sharableBudgetInfo);

    return sharableBudgetInfo;
  } catch (error) {
    throw error;
  }
}

async function deleteSharedBudgetInformation(
  userId: mongoose.Types.ObjectId,
  sharedBudgetInfo: ShareableBudget
) {
  try {
    const budget = await budgetModel.findOne(
      { owner: userId },
      "owner isShared shareId"
    );
    if (!budget) {
      throw new Error("No budget found for specified user");
    }

    await sharedBudgetInfo.deleteOne();
    await syncBudgetWithShareableBudgetInfo(budget, null);
  } catch (error) {
    throw error;
  }
}

async function syncBudgetWithShareableBudgetInfo(
  budgetDocument: Budget,
  sharedBudgetInfo: ShareableBudget | null
) {
  try {
    if (sharedBudgetInfo) {
      budgetDocument.shareCode = sharedBudgetInfo.joinCode;
      budgetDocument.isShared = true;
      budgetDocument.shareId = sharedBudgetInfo._id as mongoose.Types.ObjectId;
    } else {
      budgetDocument.shareCode = null;
      budgetDocument.isShared = false;
      budgetDocument.set("shareId", null);
    }
    return await budgetDocument.save();
  } catch (error) {
    throw error;
  }
}

function generateJoinCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const characterLength = characters.length;
  const CODE_CHARACTER_LENGTH = 4;
  let result = "";
  for (let i = 0; i < CODE_CHARACTER_LENGTH; i++) {
    result += characters.charAt(Math.floor(Math.random() * characterLength));
  }

  return result;
}
