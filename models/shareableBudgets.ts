import mongoose from "mongoose";

export interface ShareableBudget extends mongoose.Document {
    owner: mongoose.Types.ObjectId,
    budgetId: mongoose.Types.ObjectId,
    joinCode: string,
    requestedAccounts: mongoose.Types.Array<mongoose.Types.ObjectId>
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