import mongoose from "mongoose";

export interface ShareableBudget extends mongoose.Document {
    owner: mongoose.Schema.Types.ObjectId,
    budgetId: mongoose.Schema.Types.ObjectId,
    joinCode: string,
    requestedAccounts: mongoose.Schema.Types.ObjectId[]
}

const ShareableBudgetSchema = new mongoose.Schema<ShareableBudget>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Budget"
    },
    joinCode: {
        type: String
    },
    requestedAccounts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
})

export default mongoose.models.ShareableBudget || mongoose.model<ShareableBudget>("ShareableBudget", ShareableBudgetSchema);