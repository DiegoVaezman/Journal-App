import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from 'firebase/auth';

export interface AuthState {
    status: 'checking' | 'not-authenticated' | 'authenticated';
    uid: string | null;
    email: string | null;
    displayName: string | null;
    photoUrl: string | null;
    errorMessage: string | null;
}

export interface LoginPayload {
    displayName: string;
    email: string;
    photoUrl: string;
    uid: string;
}

const initialState: AuthState = {
    status: 'checking',
    uid: null,
    email: null,
    displayName: null,
    photoUrl: null,
    errorMessage: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<LoginPayload> ) => {
            state.status = 'authenticated';
            state.uid = action.payload.uid;
            state.email = action.payload.email;
            state.displayName = action.payload.displayName;
            state.photoUrl = action.payload.photoUrl;
            state.errorMessage = null;
        },
        logout: (state, action: PayloadAction<string | null> ) => {
            state.status = 'not-authenticated';
            state.uid = null;
            state.email = null;
            state.displayName = null;
            state.photoUrl = null;
            state.errorMessage = action.payload;
        },
        checkingCredentials: (state) => {
            state.status = 'checking';
        },
    }
});


// Action creators are generated for each case reducer function
export const { login, logout, checkingCredentials } = authSlice.actions;