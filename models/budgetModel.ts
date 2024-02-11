import mongoose from "mongoose";
import { User } from "./userModel";
import { Expense } from "./expenseModel";
import { Income } from "./incomeModel";

export interface Budget extends mongoose.Document {
    owner: User,
    allowed: User[],
    categories: string[],
    accounts: string[],
    income: Income[],
    expenses: Expense[],
    isShared: boolean,
    shareId: mongoose.Types.ObjectId
}

const BudgetSchema = new mongoose.Schema<Budget>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    allowed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    categories: [{
        type: String
    }],
    accounts: [{
        type: String
    }],
    income: [{type: mongoose.Schema.Types.ObjectId, ref: "Income"}],
    expenses: [{type: mongoose.Schema.Types.ObjectId, ref: "Expense"}],
    isShared: {
        type: Boolean,
        default: false
    },
    shareId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShareableBudget"
    }
})

export default mongoose.models.Budget || mongoose.model<Budget>("Budget", BudgetSchema);