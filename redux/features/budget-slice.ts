import { Expense } from "@/models/expenseModel";
import { Income } from "@/models/incomeModel";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { BudgetView } from "@/types/budget";

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
    isOwner: boolean,
    isShared: boolean;
    shareCode?: string | null;
    joinRequests?: any[],
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
        isOwner: false,
        isShared: false,
        shareCode: null,
        joinRequests: [],
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
                    ...state.value,
                    ...action.payload,
                    totalIncome: getTotalIncome(action.payload),
                    totalExpenses: getTotalExpenses(action.payload),
                    balance: getBalance(action.payload),
                }
            }
        },
        setJoinRequestList: (state, action: PayloadAction<any>) => {
            return {
                value: {
                    ...state.value,
                    joinRequests: action.payload.joinRequests
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

export function useSetInitialStore({budget }: {budget: BudgetView }) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setBudget(budget))
    }, [budget, dispatch])
}

export const { setBudget, setJoinRequestList } = budget.actions;
export default budget.reducer;