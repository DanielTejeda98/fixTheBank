// Type definitions for FixTheBank

export interface InitialData {
    mappedBudget: BudgetView | null
}

export interface BudgetView {
    _id: string,
    income: any[],
    plannedIncome: PlannedIncomeView[],
    expenses: any[],
    categories: CategoryView[],
    accounts: AccountView[],
    minDate: string,
    maxDate: string,
    isOwner: boolean,
    isShared: boolean,
    shareCode: string,
    joinRequests: any[],
    lastFetched: number
}

export interface CategoryView {
    _id: string,
    name: string,
    maxMonthExpectedAmount: [{
        month: string,
        amount: number
    }]
    notes: [{
        month: string,
        note: string
    }]
}

export interface AccountView {
    _id: string,
    name: string
}

export interface PlannedIncomeView {
    _id: string,
    month: string,
    incomeStreams: any[]
}

export interface MiniUser {
    _id: string,
    username: string
}

export interface TransactionView {
    _id: string,
    type: string,
    category?: string
    account?: string,
    source?: string,
    amount: number,
    description: string,
    date: Date,
    transactionDate: Date,
    receiptImage?: string
    giftTransaction?: boolean,
    revealGiftDate?: Date,
    borrowFromNextMonth?: boolean,
    createdBy: MiniUser,
    updatedBy: MiniUser,
    splitPaymentMasterId?: string | null
}