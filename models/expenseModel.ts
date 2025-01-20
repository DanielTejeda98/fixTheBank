import mongoose from "mongoose";

export interface Expense extends mongoose.Document {
    createdBy: mongoose.Types.ObjectId,
    updatedBy: mongoose.Types.ObjectId,
    amount: number,
    account: mongoose.Types.ObjectId,
    category: mongoose.Types.ObjectId,
    date: Date,
    transactionDate: Date,
    description: string,
    budgetId: mongoose.Schema.Types.ObjectId,
    receiptImage: string
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Please provide an account for the expense"]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
        required: [true, "Please provide a category for the expense"]
    },
    date: {
        type: Date,
        required: [true, "Please provide a date for the expense"]
    },
    transactionDate: {
        type: Date
    },
    description: {
        type: String
    },
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Budget"
    },
    receiptImage: {
        type: String,
        default: ""
    }
})

export default mongoose.models.Expense || mongoose.model<Expense>("Expense", ExpenseSchema);