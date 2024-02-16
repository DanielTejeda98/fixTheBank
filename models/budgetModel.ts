import mongoose from "mongoose";

export interface Budget extends mongoose.Document {
    owner: mongoose.Types.ObjectId,
    allowed: mongoose.Types.Array<mongoose.Types.ObjectId>,
    categories: mongoose.Types.Array<string>,
    accounts: mongoose.Types.Array<string>,
    income: mongoose.Types.Array<mongoose.Types.ObjectId>,
    expenses: mongoose.Types.Array<mongoose.Types.ObjectId>,
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