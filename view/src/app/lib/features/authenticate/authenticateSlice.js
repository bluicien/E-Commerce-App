import { createSlice } from "@reduxjs/toolkit";

const options = {
    name: "authenticate",
    initialState: {
        isAuthenticated: false
    },
    reducers: {
        authenticateUser: (state, action) => {
            return {
                ...state,
                isAuthenticated: true
            }
        },
        unAuthenticateUser: (state, action) => {
            state.isAuthenticated = false
        }
    }
}

const authenticateSlice = createSlice(options);

export const { authenticateUser, unAuthenticateUser } = authenticateSlice.actions;
export default authenticateSlice.reducer;