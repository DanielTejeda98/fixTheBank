export interface SavingsTransaction {
    _id: string;
    name: string;
    amount: number;
    date: string;
    transactionType: "depost" | "withdraw";
    bucket: string;
    addedBy: string;
    updatedBy: string;
}

export interface SavingsBuckets {
    _id: string;
    savingsAccount: string;
    name: string;
    goal: number;
    goalBy: string;
    currentTotal: number;
}

export interface SavingsAccount {
    _id: string;
    name: string;
    savings: string;
    addedBy: string;
    updatedBy: string;
    buckets: SavingsBuckets[];
    ledger: SavingsTransaction[];
    currentTotal: number;
}

export interface PlannedSaving {
    account: string;
    bucket: string;
    amount: number;
}

export interface PlannedSavings {
    month: string;
    savingsPlans: PlannedSaving[];
}

export interface Savings {
    _id: string;
    budget: string;
    savingsAccounts: SavingsAccount[];
    plannedSavings: any[];
}