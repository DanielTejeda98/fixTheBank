import dbConnect from "@/app/lib/dbConnect";
import { findBudget } from "@/helpers/budgetHelpers";
import accountModel, { Account } from "@/models/accountModel";
import { Budget } from "@/models/budgetModel";

export async function createAccount (userId: string, name: string): Promise<Account> {
    try {
        await dbConnect();
        const budget = await findBudget(userId) as Budget;

        const account = await accountModel.create({
            budgetId: budget._id,
            name
        })

        if(!account) {
            throw new Error("Failed to create account!")
        }

        budget.accounts.push(account._id);
        await budget.save();

        return account;
    } catch (error) {
        throw error;
    }
}

export async function updateAccount (accountId: string, userId: string, name: string) {
    try {
        await dbConnect()
        const budget = await findBudget(userId) as Budget;

        if(!canAccessAccountCheck(accountId, budget)) {
            throw new Error("Account was not found!")
        }

        const account = await accountModel.findById(accountId) as Account;

        account.name = name;

        account.save();

        return account;
    } catch (error) {
        throw error;
    }
}

export async function deleteAccount (accountId: string, userId: string): Promise<Account> {
    try {
        await dbConnect();
        const budget = await findBudget(accountId) as Budget;

        if(!canAccessAccountCheck(accountId, budget)) {
            throw new Error("Category not found in budget!");
        }

        const deletedAccount = await accountModel.findByIdAndDelete(accountId) as Account;

        return deletedAccount;
    } catch (error) {
        throw error;
    }
}

function canAccessAccountCheck (accountId: string, budget: Budget): Boolean {
    return budget.accounts.includes(new mongoose.Types.ObjectId(accountId));
}