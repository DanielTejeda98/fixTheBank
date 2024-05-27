import mongoose from "mongoose";

export interface SavingsTransaction extends mongoose.Document {
    amount: Number,
    date: Date,
    transactionType: "deposit" | "withdraw",
    bucket: mongoose.Types.ObjectId,
    addedBy: mongoose.Types.ObjectId,
    updatedBy: mongoose.Types.ObjectId
}

export interface SavingsAccount extends mongoose.Document {
    savings: mongoose.Types.ObjectId,
    addedBy: mongoose.Types.ObjectId,
    updatedBy: mongoose.Types.ObjectId,
    buckets: mongoose.Types.Array<mongoose.Types.ObjectId>,
    ledger: mongoose.Types.Array<SavingsTransaction>,
    currentTotal: Number,
}

const SavingsAccountSchema = new mongoose.Schema<SavingsAccount>({
    savings: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Savings"
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    buckets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SavingsAccountBucket"
    }],
    ledger: [{
        type: {
            amount: {
                type: Number,
                required: true,
                default: 0
            },
            date: {
                type: Date,
                required: true
            },
            transactionType: {
                type: String,
                validate: {
                    validator: (value: string) => ["deposit", "withdraw"].includes(value),
                    message: (props: any) => `${props.value} is not a valid TransactionType option!`
                },
                required: true
            },
            bucket: {
                type: mongoose.Schema.Types.ObjectId
            },
            addedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            updatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    }],
    currentTotal: {
        type: Number,
        default: 0
    }
})

export default mongoose.models.SavingsAccount || mongoose.model<SavingsAccount>("SavingsAccount", SavingsAccountSchema);