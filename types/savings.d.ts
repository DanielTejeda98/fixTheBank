type TransactionType = "deposit" | "withdraw"; 

export interface SavingsTransaction {
    _id: string;
    name: string;
    amount: number;
    date: string;
    transactionType: TransactionType;
    bucket: string;
    addedBy: string;
    updatedBy: string;
}

export interface SavingsTransactionRequest {
    accountId: string;
    name: string;
    amount: number;
    date: string;
    transactionType: TransactionType;
    bucket: string;
}

export interface SavingsBuckets {
    _id: string;
    savingsAccount: string;
    name: string;
    goal: number;
    goalBy: string;
    currentTotal: number;
}

export interface SavingsBucketRequest {
    name: string,
    goal: number,
    goalBy: string
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

export interface PlannedSavingRequest {
    account: string;
    bucket: string;
    amount: number;
    description: string;
}

export interface PlannedSaving {
    _id: string;
    account: string;
    bucket: string;
    amount: number;
    description: string;
}

export interface PlannedSavings {
    month: string;
    savingsPlans: PlannedSaving[];
}

export interface Savings {
    _id: string;
    budget: string;
    savingsAccounts: SavingsAccount[];
    plannedSavings: PlannedSavings[];
}