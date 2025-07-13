import mongoose from "mongoose";

export interface SplitPaymentMaster extends mongoose.Document {
    createdBy: mongoose.Types.ObjectId,
    updatedBy: mongoose.Types.ObjectId,
    budgetId: mongoose.Types.ObjectId,
    totalAmount: number,
    numberOfPayments: number,
    payments: mongoose.Types.ObjectId[]
}

const SplitPaymentMasterSchema = new mongoose.Schema<SplitPaymentMaster>({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Budget",
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    numberOfPayments: {
        type: Number,
        required: true
    },
    payments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense"
    }]
})

export default mongoose.models.SplitPaymentMaster || mongoose.model<SplitPaymentMaster>("SplitPaymentMaster", SplitPaymentMasterSchema);