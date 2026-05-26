import mongoose from "mongoose";

export interface TemplateModel extends mongoose.Document {
  name: string;
  description: string;
  type: "expense" | "income" | "transfer";
  data: JSON;
  recurringSettings: {
    frequency: "none" | "daily" | "weekly" | "biweekly" | "monthly" | "yearly";
    endCondition: "never" | "afterOccurrences" | "onDate";
    occurrences?: number;
    endDate?: Date;
  };
  recurringMeta?: {
    lastOccurrence?: Date;
    nextOccurrence: Date;
    occurrencesLeft: number;
    isActive: boolean;
  };
  budgetId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new mongoose.Schema<TemplateModel>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["expense", "income", "transfer"],
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    recurringSettings: {
      frequency: {
        type: String,
        enum: ["none", "daily", "weekly", "biweekly", "monthly", "yearly"],
        default: "none",
      },
      endCondition: {
        type: String,
        enum: ["never", "afterOccurrences", "onDate"],
        default: "never",
      },
      occurrences: {
        type: Number,
        min: 1,
      },
      endDate: {
        type: Date,
      },
    },
    recurringMeta: {
      lastOccurrence: {
        type: Date,
      },
      nextOccurrence: {
        type: Date,
      },
      occurrencesLeft: {
        type: Number,
        min: 0,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Template ||
  mongoose.model<TemplateModel>("Template", TemplateSchema);
