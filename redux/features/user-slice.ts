import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
    value: UserState;
}

type UserState = {
    _id: string;
    username: string,
    email: string
}

const initialState = {
    value: {
        _id: "",
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
                    ...action.payload,
                }
            }
        }
    }
})

export const { setUser } = user.actions;
export default user.reducer;