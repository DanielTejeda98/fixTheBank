import { Expense } from "@/models/expenseModel";
import { Income } from "@/models/incomeModel";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  AccountView,
  BudgetView,
  CategoryView,
  ExpenseTransaction,
  IncomeTransaction,
  TransferTransaction,
} from "@/types/budget";
import { getTotalPlannedSavings, setSavings } from "./savings-slice";
import { Savings, SavingsAccount } from "@/types/savings";

type InitialState = {
  value: BudgetState;
};

type BudgetState = {
  _id: string;
  categories: CategoryView[];
  accounts: AccountView[];
  income: IncomeTransaction[];
  plannedIncome: any[];
  expenses: ExpenseTransaction[];
  transfers: TransferTransaction[];
  minDate: string;
  maxDate: string;
  isOwner: boolean;
  isShared: boolean;
  shareCode?: string | null;
  joinRequests?: any[];
  balance?: number;
  totalPlannedIncome?: number;
  totalAllocated?: number;
  totalIncome?: number;
  totalExpenses?: number;
  lastFetched: number;
};

const initialState = {
  value: {
    _id: "",
    categories: [],
    accounts: [],
    income: [],
    plannedIncome: [],
    expenses: [],
    transfers: [],
    minDate: "",
    maxDate: "",
    isOwner: false,
    isShared: false,
    shareCode: null,
    joinRequests: [],
    balance: 0,
    totalPlannedIncome: 0,
    totalAllocated: 0,
    totalIncome: 0,
    totalExpenses: 0,
    lastFetched: new Date().getTime(),
  } as BudgetState,
} as InitialState;

const getTotalPlannedIncome = (budget: any): number => {
  return budget.plannedIncome
    .find((pi: any) => pi.month === budget.minDate)
    ?.incomeStreams.reduce(
      (acc: number, current: any) => acc + current.amount,
      0
    );
};

const getTotalAllocated = (budget: any): number => {
  return budget.categories
    .map((x: any) =>
      x.maxMonthExpectedAmount.find((x: any) => x.month === budget.minDate)
    )
    .reduce((acc: number, curr: any) => {
      if (!curr) {
        return acc;
      }
      return acc + curr.amount;
    }, 0);
};

const getTotalIncome = (budget: any): number => {
  return budget.income.reduce((total: number, current: Income) => {
    return total + current.amount;
  }, 0);
};

const getTotalExpenses = (budget: any): number => {
  return budget.expenses.reduce((total: number, current: Expense) => {
    if (
      current.borrowFromNextMonth &&
      new Date(current.date).getMonth() != new Date(budget.minDate).getMonth()
    ) {
      return total; // Ignore expenses borrowed from next month that are in the future
    }
    return total + current.amount;
  }, 0);
};

const getTransferBalance = (budget: BudgetState): number => {
  return budget.transfers.reduce((total, curr) => {
    if (curr.transactionType === "deposit") return total + curr.amount;

    return total - curr.amount;
  }, 0);
};

const getBalance = (budget: BudgetState): number => {
  return (
    getTotalIncome(budget) -
    getTotalExpenses(budget) -
    getTransferBalance(budget)
  );
};

export const budget = createSlice({
  name: "budget",
  initialState,
  reducers: {
    setBudget: (state, action: PayloadAction<BudgetState>) => {
      return {
        value: {
          ...state.value,
          ...action.payload,
          totalPlannedIncome: getTotalPlannedIncome(action.payload),
          totalAllocated: getTotalAllocated(action.payload),
          totalIncome: getTotalIncome(action.payload),
          totalExpenses: getTotalExpenses(action.payload),
          balance: getBalance(action.payload),
        },
      };
    },
    setJoinRequestList: (state, action: PayloadAction<any>) => {
      return {
        value: {
          ...state.value,
          joinRequests: action.payload.joinRequests,
        },
      };
    },
    setBudgetShareSettings: (
      state,
      action: PayloadAction<{ isShared: boolean; shareCode: string | null }>
    ) => {
      return {
        value: {
          ...state.value,
          isShared: action.payload.isShared,
          shareCode: action.payload.shareCode,
        },
      };
    },
  },
});

export const selectIncome = (state: RootState) =>
  state.budgetReducer.value.income;
export const selectExpense = (state: RootState) =>
  state.budgetReducer.value.expenses;
export const selectTransfers = (state: RootState) =>
  state.budgetReducer.value.transfers;
export const selectCategories = (state: RootState) =>
  state.budgetReducer.value.categories;
export const selectAccounts = (state: RootState) =>
  state.budgetReducer.value.accounts;

export const selectTransactions = createSelector(
  [selectIncome, selectExpense, selectTransfers],
  (income, expenses, transfers) => {
    return [...income, ...expenses, ...transfers];
  }
);

export const selectUnallocatedFunds = (state: RootState) => {
  return (
    (state.budgetReducer.value.totalPlannedIncome || 0) -
    ((state.budgetReducer.value.totalAllocated || 0) +
      getTotalPlannedSavings(
        state.savingsReducer.value,
        state.budgetReducer.value.minDate
      ))
  );
};

export function useSetInitialStore({
  budget,
  savings,
}: {
  budget: BudgetView | null;
  savings: Savings;
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    budget && dispatch(setBudget(budget));
    savings && dispatch(setSavings(savings));
  }, [budget, dispatch]);
}

export const { setBudget, setJoinRequestList, setBudgetShareSettings } =
  budget.actions;
export default budget.reducer;
