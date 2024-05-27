import mongoose from "mongoose";

export interface PlannedSavings {
    month: String,
    plannedSavings: mongoose.Types.Array<{
        account: mongoose.Types.ObjectId,
        bucket: mongoose.Types.ObjectId | null,
        amount: Number
    }>
}

export interface Savings extends mongoose.Document {
    budget: mongoose.Types.ObjectId,
    savingsAccounts: mongoose.Types.Array<mongoose.Types.ObjectId>,
    plannedSavings: mongoose.Types.Array<PlannedSavings>,
    totalSavings: Number
}

const SavingsSchema = new mongoose.Schema<Savings>({
    budget: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Budget"
    },
    savingsAccounts: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    plannedSavings: [{
        type: {
            month: String,
            savingsPlans: [{
                type: {
                    account: { 
                        type: mongoose.Types.ObjectId, 
                        required: true 
                    },
                    bucket: { 
                        type: mongoose.Types.ObjectId 
                    },
                    amount: Number
                }
            }]
        }
    }],
    totalSavings: {
        type: Number,
        default: 0
    }
})

export default mongoose.models.Savings || mongoose.model<Savings>("Savings", SavingsSchema)