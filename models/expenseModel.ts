import mongoose from "mongoose";
import { User } from "./userModel";

export interface Expense extends mongoose.Document {
    createdBy: User,
    updatedBy: User,
    amount: number,
    account: string
    category: string
    date: Date,
    description: string,
    budgetId: mongoose.Schema.Types.ObjectId
}

const ExpenseSchema = new mongoose.Schema<Expense>({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    amount: {
        type: Number,
        default: 0
    },
    account: {
        type: String,
        required: [true, "Please provide an account for the expense"]
    },
    category: {
        type: String,
        required: [true, "Please provide a category for the expense"]
    },
    date: {
        type: Date,
        required: [true, "Please provide a date for the expense"]
    },
    description: {
        type: String
    },
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Budget"
    }
})

export default mongoose.models.Expense || mongoose.model<Expense>("Expense", ExpenseSchema);