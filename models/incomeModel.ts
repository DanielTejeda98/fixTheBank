import mongoose from "mongoose";

export interface Income extends mongoose.Document {
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  amount: number;
  source: string;
  date: Date;
  budgetId: mongoose.Schema.Types.ObjectId;
  reconciled: Date | null;
  reconciledBy: mongoose.Types.ObjectId | null;
}

const IncomeSchema = new mongoose.Schema<Income>({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: {
    type: Number,
    default: 0,
  },
  source: {
    type: String,
    required: [true, "Please provide a source for the income"],
  },
  date: {
    type: Date,
    required: true,
  },
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Budget",
  },
  reconciled: {
    type: Date,
    default: null,
  },
  reconciledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

export default mongoose.models.Income ||
  mongoose.model<Income>("Income", IncomeSchema);
