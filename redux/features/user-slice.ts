import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
    value: UserState
}

export type UserState = {
    username: string,
    email: string
}

const initialState = {
    value: {
        username: "",
        email: ""
    } as UserState
} as InitialState

export const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            return {
                value: {
                    ...state.value,
                    ...action.payload
                }
            }
        },
    }
})

export const { setUser } = user.actions;
export default user.reducer;