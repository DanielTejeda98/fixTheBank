// Type definitions for FixTheBank

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
    joinRequests: any[]
}

export interface CategoryView {
    _id: string,
    name: string,
    maxMonthExpectedAmount: any
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

export interface TransactionView {
    _id: string,
    type: string,
    category?: string
    account?: string,
    source?: string,
    amount: number,
    description: string,
    date: Date
}