import mongoose from 'mongoose';

export interface SavingsBuckets extends mongoose.Document {
    name: String,
    goal: Number,
    goalBy: Date,
    currentTotal: Number
}

const SavingsAccountBucketSchema = new mongoose.Schema<SavingsBuckets>({
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