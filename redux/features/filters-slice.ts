import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
    value: FilterState
}

export type FilterState = {
    categoryFilters: string[];
    accountFilters: string[];
}

const initialState = {
    value: {
        categoryFilters: [],
        accountFilters: []
    } as FilterState
} as InitialState

export const filters = createSlice({
    name: "filters",
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<FilterState>) => {
            return {
                value: {
                    ...state.value,
                    ...action.payload
                }
            }
        }
    }
})

export const { setFilters } = filters.actions;
export default filters.reducer;