// Type definitions for FixTheBank

import { Savings } from "./savings";
import { User } from "./user";

export interface InitialData {
  mappedBudget: BudgetView | null;
  savings: Savings;
}

export interface BudgetView {
  _id: string;
  income: IncomeTransaction[];
  plannedIncome: PlannedIncomeView[];
  expenses: ExpenseTransaction[];
  transfers: TransferTransaction[];
  categories: CategoryView[];
  accounts: AccountView[];
  minDate: string;
  maxDate: string;
  isOwner: boolean;
  isShared: boolean;
  shareCode: string;
  joinRequests: any[];
  lastFetched: number;
}

export interface CategoryView {
  _id: string;
  name: string;
  maxMonthExpectedAmount: [
    {
      month: string;
      amount: number;
    }
  ];
  notes: [
    {
      month: string;
      note: string;
    }
  ];
}

export interface AccountView {
  _id: string;
  name: string;
}

export interface PlannedIncomeView {
  _id: string;
  month: string;
  incomeStreams: any[];
}

export interface MiniUser {
  _id: string;
  username: string;
}

export interface IncomeTransaction {
  _id: string;
  createdBy: User;
  updatedBy: User;
  amount: number;
  source: string;
  date: Date;
  budgetId: string;
  reconciled: Date | null;
  reconciledBy: User;
}

export interface ExpenseTransaction {
  _id: string;
  createdBy: User;
  updatedBy: User;
  amount: number;
  account: string;
  category: string;
  date: Date;
  transactionDate: Date;
  description: string;
  budgetId: string;
  receiptImage: string;
  borrowFromNextMonth: boolean;
  giftTransaction: boolean;
  revealGiftDate?: Date;
  splitPaymentMasterId?: string | null;
  reconciled: Date | null;
  reconciledBy: User;
}

export interface TransferTransaction {
  _id: string;
  name: string;
  amount: number;
  date: Date;
  transactionType: "deposit" | "withdraw";
  account: string;
  bucket: string;
  savingsTransferId: string;
  budgetId: string;
  createdBy: User;
  updatedBy: User;
}

export interface TransactionView {
  _id: string;
  type: string;
  category?: string;
  account?: string;
  source?: string;
  amount: number;
  description: string;
  date: Date;
  transactionDate: Date;
  receiptImage?: string;
  giftTransaction?: boolean;
  revealGiftDate?: Date;
  borrowFromNextMonth?: boolean;
  createdBy: MiniUser;
  updatedBy: MiniUser;
  splitPaymentMasterId?: string | null;
}
