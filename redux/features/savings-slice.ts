import { Savings } from "@/types/savings";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type InitialState = {
  value: SavingsState;
};

type SavingsState = Savings;

const initialState = {
  value: {
    _id: "",
    budget: "",
    savingsAccounts: [],
    plannedSavings: [],
    totalPlannedSavings: 0,
  },
} as InitialState;

export const savings = createSlice({
  name: "savings",
  initialState,
  reducers: {
    setSavings: (state, action: PayloadAction<Partial<SavingsState>>) => {
      return {
        value: {
          ...state.value,
          ...action.payload,
        },
      };
    },
    updatePlannedSavings: (state, action) => {
      const psMonthToUpdate = state.value.plannedSavings?.find(
        (ps) => ps.month === action.payload.month
      );
      if (!psMonthToUpdate && state.value.plannedSavings) {
        state.value.plannedSavings.push(action.payload);
        return;
      }
      if (psMonthToUpdate)
        psMonthToUpdate.savingsPlans = action.payload.savingsPlans;
    },
  },
});

export const getTotalPlannedSavings = (
  savings: Savings,
  budgetMonth: string
) => {
  return (
    savings.plannedSavings
      .find((ps) => ps.month === budgetMonth)
      ?.savingsPlans.reduce(
        (spTotal: number, spCurrent) => (spTotal += spCurrent.amount),
        0
      ) || 0
  );
};

export const selectSavingsAccounts = (state: RootState) =>
  state.savingsReducer.value.savingsAccounts;

export const { setSavings, updatePlannedSavings } = savings.actions;
export default savings.reducer;
