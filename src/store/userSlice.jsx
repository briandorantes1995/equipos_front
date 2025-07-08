import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null,
    isAuthenticated: false,
    user: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            // action.payload = { token, user }
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = !!action.payload.token;
        },
        clearAuth: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
        }
    }
});

export const { setAuth, clearAuth } = userSlice.actions;
export default userSlice.reducer;

