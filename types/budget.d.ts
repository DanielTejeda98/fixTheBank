// Type definitions for FixTheBank

export interface BudgetView {
    _id: string,
    income: any[],
    expenses: any[],
    categories: string[],
    accounts: string[],
    minDate: string,
    maxDate: string,
    isOwner: boolean,
    isShared: boolean,
    shareCode: string,
    joinRequests: any[]
}