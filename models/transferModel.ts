import mongoose from "mongoose";

export interface TransferModel extends mongoose.Document {
  name: string;
  amount: number;
  date: Date;
  transactionType: "deposit" | "withdraw";
  account: mongoose.Types.ObjectId;
  bucket: mongoose.Types.ObjectId;
  savingsTransferId: mongoose.Types.ObjectId;
  budgetId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
}

const TransferSchema = new mongoose.Schema<TransferModel>({
  name: {
    type: String,
    default: "",
  },
  amount: {
    type: Number,
    default: 0,
    min: 0,
  },
  date: {
    type: Date,
    required: true,
  },
  transactionType: {
    type: String,
    enum: ["deposit", "withdraw"],
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SavingsAccount",
    required: true,
  },
  bucket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SavingsAccountBucket",
    required: true,
  },
  savingsTransferId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Budget",
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.models.Transfer ||
  mongoose.model<TransferModel>("Transfer", TransferSchema);
