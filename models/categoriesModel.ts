import mongoose from "mongoose";

type CategoryMonthlyMax = {
    month: String,
    amount: Number
}

type Note = {
    month: String,
    note: String
}

export interface Category extends mongoose.Document {
    budgetId: mongoose.Types.ObjectId,
    name: String,
    sortRank: Number,
    maxMonthExpectedAmount: mongoose.Types.Array<CategoryMonthlyMax>,
    notes: mongoose.Types.Array<Note>
}

const CategoriesSchema = new mongoose.Schema<Category>({
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Budget"
    },
    name: {
        type: String,
        required: true
    },
    sortRank: {
        type: Number, 
        default: 0
    },
    maxMonthExpectedAmount: {
        type: [{
            month: String,
            amount: Number
        }]
    },
    notes: {
        type: [{
            month: String,
            note: String,
        }]
    }
})

export default mongoose.models.Categories || mongoose.model<Category>("Categories", CategoriesSchema);