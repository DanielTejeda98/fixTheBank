import mongoose from "mongoose";

export interface PlannedIncome {
    month: String,
    incomeStreams: mongoose.Types.Array<{source: String, amount: Number}>
}

export interface Budget extends mongoose.Document {
    owner: mongoose.Types.ObjectId,
    allowed: mongoose.Types.Array<mongoose.Types.ObjectId>,
    categories: mongoose.Types.Array<mongoose.Types.ObjectId>,
    accounts: mongoose.Types.Array<mongoose.Types.ObjectId>,
    income: mongoose.Types.Array<mongoose.Types.ObjectId>,
    plannedIncome: mongoose.Types.Array<PlannedIncome>
    expenses: mongoose.Types.Array<mongoose.Types.ObjectId>,
    savings: mongoose.Types.ObjectId,
    isShared: boolean,
    shareCode: string | null,
    shareId: mongoose.Types.ObjectId
}

const BudgetSchema = new mongoose.Schema<Budget>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    allowed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories"
    }],
    accounts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    }],
    income: [{type: mongoose.Schema.Types.ObjectId, ref: "Income"}],
    plannedIncome: [{
        type: {
            month: String,
            incomeStreams: [{
                type: {
                    source: String,
                    amount: Number
                }
            }]
        }
    }],
    expenses: [{type: mongoose.Schema.Types.ObjectId, ref: "Expense"}],
    savings: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Savings"
    },
    isShared: {
        type: Boolean,
        default: false
    },
    shareCode: {
        type: String,
        default: null
    },
    shareId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShareableBudget"
    }
})

export default mongoose.models.Budget || mongoose.model<Budget>("Budget", BudgetSchema);