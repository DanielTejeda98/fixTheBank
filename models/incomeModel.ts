import mongoose from "mongoose";
import { User } from "./userModel";

export interface Income extends mongoose.Document {
    createdBy: User,
    updatedBy: User,
    amount: number,
    source: string,
    date: Date,
    budgetId: mongoose.Schema.Types.ObjectId
}

const IncomeSchema = new mongoose.Schema<Income>({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    amount: {
        type: Number,
        default: 0
    },
    source: {
        type: String,
        required: [true, "Please provide a source for the income"]
    },
    date: {
        type: Date,
        required: true
    },
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Budget"
    }
})

export default mongoose.models.Income || mongoose.model<Income>("Income", IncomeSchema);