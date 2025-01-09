import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
    value: SettingsState
}

export type SettingsState = {
    useDarkMode: boolean,
    dateTodayButtonOnLeft: boolean
}

const initialState = {
    value: {
        useDarkMode: false,
        dateTodayButtonOnLeft: false
    } as SettingsState
} as InitialState

export const settings = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setSettings: (state, action: PayloadAction<SettingsState>) => {
            return {
                value: {
                    ...state.value,
                    ...action.payload
                }
            }
        },
    }
})

export const { setSettings } = settings.actions;
export default settings.reducer;