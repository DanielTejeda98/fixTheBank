import mongoose from "mongoose";

export interface Account extends mongoose.Document {
  budgetId: mongoose.Types.ObjectId;
  name: string;
}

const AccountSchema = new mongoose.Schema<Account>({
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Budget",
  },
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Account ||
  mongoose.model<Account>("Account", AccountSchema);
