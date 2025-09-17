import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null,
    isAuthenticated: false,
    user: null,
    rol: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            // action.payload = { token, user }
            const user = action.payload.user;
            state.token = action.payload.token;
            state.user = user;
            state.rol = user["https://tuapp.com/claims/roles"]
                ? user["https://tuapp.com/claims/roles"][0]
                : "guest";
            state.isAuthenticated = !!action.payload.token;
        },
        clearAuth: (state) => {
            state.token = null;
            state.user = null;
            state.rol = null;
            state.isAuthenticated = false;
        }
    }
});

export const { setAuth, clearAuth } = userSlice.actions;
export default userSlice.reducer;

