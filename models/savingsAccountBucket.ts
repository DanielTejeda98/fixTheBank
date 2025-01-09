import mongoose from 'mongoose';

export interface SavingsBuckets extends mongoose.Document {
    savingsAccount: mongoose.Types.ObjectId,
    name: String,
    goal: Number,
    goalBy: Date,
    currentTotal: Number
}

const SavingsAccountBucketSchema = new mongoose.Schema<SavingsBuckets>({
    savingsAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SavingsAccount"
    },
    name: {
        type: String,
        required: true,
        default: ""
    },
    goal: {
        type: Number,
    },
    goalBy: {
        type: Date
    },
    currentTotal: {
        type: Number,
        default: 0
    }
})

export default mongoose.models.SavingsAccountBucket || mongoose.model<SavingsBuckets>("SavingsAccountBucket", SavingsAccountBucketSchema);