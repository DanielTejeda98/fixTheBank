import { Expense } from "@/models/expenseModel";
import { Income } from "@/models/incomeModel";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type InitialState = {
    value: BudgetState;
}

type BudgetState = {
    _id: string;
    categories: string[];
    accounts: string[];
    income: any[];
    expenses: any[];
    minDate: string;
    maxDate: string;
    balance?: number,
    totalIncome?: number,
    totalExpenses?: number
}

const initialState = {
    value: {
        _id: "",
        categories: [],
        accounts: [],
        income: [],
        expenses: [],
        minDate: "",
        maxDate: "",
        balance: 0,
        totalIncome: 0,
        totalExpenses: 0
    } as BudgetState
} as InitialState

const getTotalIncome = (budget:any): number => {
    return budget.income.reduce((total:number, current: Income) => {
        return total + current.amount;
    }, 0)
}

const getTotalExpenses = (budget:any): number => {
    return budget.expenses.reduce((total:number, current: Expense) => {
        return total + current.amount;
    }, 0)
}

const getBalance = (budget:any): number => {
    return getTotalIncome(budget) - getTotalExpenses(budget)
}

export const budget = createSlice({
    name: "budget",
    initialState,
    reducers: {
        setBudget: (state, action: PayloadAction<BudgetState>) => {
            return {
                value: {
                    ...action.payload,
                    totalIncome: getTotalIncome(action.payload),
                    totalExpenses: getTotalExpenses(action.payload),
                    balance: getBalance(action.payload),
                }
            }
        }
    }
})

const selectIncome = (state:RootState) => state.budgetReducer.value.income;
const selectExpense = (state:RootState) => state.budgetReducer.value.expenses;

export const selectTransactions = createSelector([selectIncome, selectExpense], (income, expenses) => {
    return [...income, ...expenses]
})

export const { setBudget } = budget.actions;
export default budget.reducer;