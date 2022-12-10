import { loginWithEmailPassword, LoginWithEmailPasswordProps, logoutFirebase, registerWithEmailPassword, RegisterWithEmailPasswordProps, signInWithGoogle } from '../../firebase/providers';
import { clearNotesLogout } from '../journal';
import { AppDispatch, RootState } from '../store'
import { checkingCredentials, login, logout } from './authSlice'


export const checkingAuthentication = () => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(checkingCredentials());
    }
}

export const startGoogleSignIn = () => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(checkingCredentials());
        const result = await signInWithGoogle();
        const {ok, uid, email, photoUrl, displayName, errorMessage } = result;
        if (!ok) return dispatch(logout(errorMessage!));
        dispatch(login({uid: uid!, email: email!,  photoUrl: photoUrl!, displayName: displayName!}));
    }
}

export const startCreatingUserWithEmailPassword = ({email: mail, password, displayName: name}: RegisterWithEmailPasswordProps) => {
    return async (dispatch: AppDispatch) => {
        dispatch(checkingCredentials());
        const result = await registerWithEmailPassword({email: mail, password, displayName: name});
        const {ok, uid, email, photoUrl, displayName, errorMessage } = result;
        if (!ok) return dispatch(logout(errorMessage!));
        dispatch(login({uid: uid!, email: email!,  photoUrl: photoUrl!, displayName: displayName!}));
    }
}

export const startLoginWithEmailPassword = ({email: mail, password}: LoginWithEmailPasswordProps) => {
    return async (dispatch: AppDispatch) => {
        dispatch(checkingCredentials());
        const result = await loginWithEmailPassword({email: mail, password});
        const {ok, uid, email, photoUrl, displayName, errorMessage } = result;
        if (!ok) return dispatch(logout(errorMessage!));
        dispatch(login({uid: uid!, email: email!,  photoUrl: photoUrl!, displayName: displayName!}));
    }
}

export const startLogout = () => {
    return async (dispatch: AppDispatch) => {
        await logoutFirebase();
        dispatch(clearNotesLogout());
        dispatch(logout(null));
    }
}

