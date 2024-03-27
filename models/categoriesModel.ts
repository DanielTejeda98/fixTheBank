import mongoose from "mongoose";

type CategoryMonthlyMax = {
    month: Date,
    amount: Number
}

export interface Category extends mongoose.Document {
    budgetId: mongoose.Types.ObjectId,
    name: String,
    sortRank: Number,
    maxMonthExpectedAmount: mongoose.Types.Array<CategoryMonthlyMax>,
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
            month: Date,
            amount: Number
        }]
    },
})

export default mongoose.models.Budget || mongoose.model<Category>("Categories", CategoriesSchema);