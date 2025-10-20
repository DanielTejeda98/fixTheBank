export type BudgetShareResponse = {
    success: boolean;
    data?: {
        budgetId: string;
        joinCode: string;
        owner: string;
        requestedAccounts: string[];
    };
    error?: string;
}