// Defines budget logic
import dbConnect from "@/app/lib/dbConnect";
import mongoose from "mongoose";
import budgetModel, { Budget } from "@/models/budgetModel";
import shareableBudgetModel, { ShareableBudget } from "@/models/shareableBudgets";
import incomeModel from "@/models/incomeModel";
import expenseModel from "@/models/expenseModel";
import userModel from "@/models/userModel";
import categoriesModel from "@/models/categoriesModel";
import accountModel, { Account } from "@/models/accountModel";

export async function getUserFullBudgetDocument(userId: mongoose.Types.ObjectId, budgetMonth: Date) {
    if (process.env.DEBUG === 'debug') {
        console.log(`[getUserFullBudgetDocument] Getting full budget document started`)
    }
    try {
        await dbConnect()
        const { minDate, maxDate } = getBudgetMinMaxDates(budgetMonth);

        const budget = await budgetModel.findOne().or([{ owner: userId }, { allowed: userId }])
            .populate({
                path: "categories",
                model: categoriesModel
            })
            .populate({
                path: "accounts",
                model: accountModel
            })
            .populate({
                path: "expenses",
                model: expenseModel,
                match: { date: { $gte: minDate, $lte: maxDate } },
            })
            .populate({
                path: "income",
                model: incomeModel,
                match: { date: { $gte: minDate, $lte: maxDate } }
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
                name: "default"
            })

            if (account) {
                budget.accounts.push(account._id);
                budget.save();
            }
        }

        return {
            ...budget._doc,
            minDate: minDate.toLocaleString("en-us", { dateStyle: "short", timeZone: "UTC" }),
            maxDate: maxDate.toLocaleString("en-us", { dateStyle: "short", timeZone: "UTC" }),
            isOwner: budget._doc.owner.toString() === userId.toString()
        };
    } catch (error) {
        throw error
    }
}

export async function createUserBudget(userId: string) {
    try {
        await dbConnect();

        const budget = await budgetModel.create({
            owner: new mongoose.Types.ObjectId(userId)
        })

        if (!budget) {
            return null;
        }

        const account = await accountModel.create({
            budgetId: budget._id,
            name: "default"
        })

        if (account) {
            budget.accounts.push(account._id);
            budget.save();
        }

        return budget;
    } catch (error) {
        throw error
    }
}

export async function toggleShareableBudget(userId: mongoose.Types.ObjectId) {
    try {
        await dbConnect();
        // Is the budget being shared?
        const sharedBudgetInfo = await shareableBudgetModel.findOne({ owner: userId });
        // if budget is not being shared, add it to the sharable budget table and sync budget
        if (!sharedBudgetInfo) {
            return await createSharedBudgetInformation(userId);
        }
        // if budget is being shared, disable share by removing from sharableBudget table and sync budget
        await deleteSharedBudgetInformation(userId, sharedBudgetInfo);
        return false;
    } catch (error) {
        throw error
    }
}

export async function joinSharedBudget(userId: mongoose.Types.ObjectId, joinCode: string) {
    try {
        await dbConnect();

        const sharedBudget = await shareableBudgetModel.findOne({ joinCode }) as ShareableBudget;
        if (!sharedBudget) {
            throw new Error("No shared budget with the provided join code: " + joinCode);
        }

        if (sharedBudget.requestedAccounts.includes(userId)) {
            throw new Error("Already requested to join budget!")
        }

        sharedBudget.requestedAccounts.push(userId)
        await sharedBudget.save();
    } catch (error) {
        throw error;
    }
}

export async function getBudgetRequesters(userId: mongoose.Types.ObjectId, budgetId: mongoose.Types.ObjectId) {
    try {
        await dbConnect();
        const sharedBudget = await shareableBudgetModel.findOne({ owner: userId, budgetId }).populate("requestedAccounts", "_id username", userModel).exec() as ShareableBudget;
        if (!sharedBudget) {
            throw new Error(`No shared budget found for budget ID ${budgetId}`);
        }

        return sharedBudget.requestedAccounts || [];

    } catch (error) {
        throw error;
    }
}

export async function approveRequesterToJoinBudget(userId: mongoose.Types.ObjectId, budgetId: mongoose.Types.ObjectId, requesterId: mongoose.Types.ObjectId) {
    if (userId === requesterId) {
        throw new Error(`Requester ID ${requesterId} is the same as budget owner ID ${userId}`);
    }

    try {
        await dbConnect();

        const budget = await budgetModel.findOne({ _id: budgetId, owner: userId }) as Budget
        if (!budget) {
            throw new Error(`No budget found for user ${userId} with the provided budget Id ${budgetId}`)
        }

        const sharedBudget = await shareableBudgetModel.findOne({ budgetId }) as ShareableBudget;
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

export async function addPlannedIncome(userId: mongoose.Types.ObjectId, monthIndex: string, newIncomeStream: { source: string, amount: Number }) {
    try {
        await dbConnect();
        const budget = await budgetModel.findOne().or([{ owner: userId }, { allowed: userId }])

        if (!budget) {
            throw new Error(`No budget found for user ID: ${userId}`)
        }

        const plannedIncomeMonthList = budget._doc.plannedIncome.find((doc: any) => doc.month === monthIndex);
        // If the month index does not exist, create one and push our new source
        if (!plannedIncomeMonthList) {
            budget.plannedIncome.push({ month: monthIndex, incomeStreams: [{ source: newIncomeStream.source, amount: newIncomeStream.amount }] });
        } else {
            plannedIncomeMonthList.incomeStreams.push({ source: newIncomeStream.source, amount: newIncomeStream.amount });
        }

        await budget.save();
    } catch (error) {
        throw error
    }
}

export async function removePlannedIncome(userId: mongoose.Types.ObjectId, monthIndex: string, incomeSourceId: mongoose.Types.ObjectId) {
    try {
        await dbConnect();
        const budget = await budgetModel.findOne().or([{ owner: userId }, { allowed: userId }])

        if (!budget) {
            throw new Error(`No budget found for user ID: ${userId}`)
        }

        const plannedIncomeMonthList = budget._doc.plannedIncome.find((doc: any) => doc.month === monthIndex);

        // If the month index does not exist, create one and push our new source
        if (!plannedIncomeMonthList) {
            throw new Error("Month index does not exist!");
        }

        plannedIncomeMonthList.pull(incomeSourceId);

        budget.save();
    } catch (error) {
        throw error
    }
}

function getBudgetMinMaxDates(budgetMonth: Date) {
    if (process.env.DEBUG === "debug") {
        console.log(`[getBudgetMinMaxDates]: Received call with budgetMonth ${budgetMonth}`);
    }
    return {
        minDate: new Date(Date.UTC(budgetMonth.getFullYear(), budgetMonth.getMonth(), 1, 0, 0, 0, 0)),
        maxDate: new Date(Date.UTC(budgetMonth.getFullYear(), budgetMonth.getMonth() + 1, 0, 23, 59, 59, 999))
    }
}

async function createSharedBudgetInformation(userId: mongoose.Types.ObjectId) {
    // get budget model assigned to user
    try {
        const budget = await budgetModel.findOne({ owner: userId }, "owner isShared shareId")
        if (!budget) {
            throw new Error("No budget found for specified user");
        }

        const joinCode = generateJoinCode();

        const possibleSharedBudget = await shareableBudgetModel.findOne({ joinCode: joinCode })
        if (possibleSharedBudget) {
            throw new Error("Unable to process, joinCode was in use.")
        }

        // create sharablebudget document
        const sharableBudgetInfo = await shareableBudgetModel.create({
            owner: userId,
            budgetId: budget._id,
            joinCode: joinCode
        })

        // sync budget model
        await syncBudgetWithShareableBudgetInfo(budget, sharableBudgetInfo);

        return sharableBudgetInfo
    } catch (error) {
        throw error
    }
}

async function deleteSharedBudgetInformation(userId: mongoose.Types.ObjectId, sharedBudgetInfo: ShareableBudget) {
    try {
        const budget = await budgetModel.findOne({ owner: userId }, "owner isShared shareId")
        if (!budget) {
            throw new Error("No budget found for specified user");
        }

        await sharedBudgetInfo.deleteOne();
        await syncBudgetWithShareableBudgetInfo(budget, null);
    } catch (error) {
        throw error
    }
}

async function syncBudgetWithShareableBudgetInfo(budgetDocument: Budget, sharedBudgetInfo: ShareableBudget | null) {
    try {
        if (sharedBudgetInfo) {
            budgetDocument.shareCode = sharedBudgetInfo.joinCode;
            budgetDocument.isShared = true;
            budgetDocument.shareId = sharedBudgetInfo._id;
        } else {
            budgetDocument.shareCode = null;
            budgetDocument.isShared = false;
            budgetDocument.set("shareId", null)
        }
        return await budgetDocument.save()
    } catch (error) {
        throw error
    }
}

function generateJoinCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const characterLength = characters.length;
    const CODE_CHARACTER_LENGTH = 4;
    let result = ""
    for (let i = 0; i < CODE_CHARACTER_LENGTH; i++) {
        result += characters.charAt(Math.floor(Math.random() * characterLength));
    }

    return result;
}