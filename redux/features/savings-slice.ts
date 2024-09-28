import { Savings } from "@/types/savings";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
    value: SavingsState;
}

type SavingsState = Savings

const initialState = {
    value: {
        _id: "",
        budget: "",
        savingsAccounts: [],
        plannedSavings: []
    }
} as InitialState

export const savings = createSlice({
    name: "savings",
    initialState,
    reducers: {
        setSavings: (state, action: PayloadAction<SavingsState>) => {
            return {
                value: {
                    ...state.value,
                    ...action.payload
                }
            }
        }
    }
})

export const { setSavings } = savings.actions;
export default savings.reducer;