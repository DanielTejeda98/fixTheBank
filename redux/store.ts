import { configureStore } from "@reduxjs/toolkit";
import budgetReducer from "./features/budget-slice";
import settingsReducer from "./features/settings-slice";
import savingsReducer from "./features/savings-slice";
import userReducer from "./features/user-slice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        budgetReducer,
        settingsReducer,
        savingsReducer,
        userReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;