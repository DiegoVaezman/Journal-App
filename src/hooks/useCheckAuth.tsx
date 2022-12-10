import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { FirebaseAuth } from '../firebase/config';
import { login, logout } from '../store/auth';
import { useAppDispatch, useAppSelector } from './redux-toolkit';
import { startLoadingNotes } from '../store/journal/thunks';

export const useCheckAuth = () => {
    const { status } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        onAuthStateChanged(FirebaseAuth, async (user) => {
            if (!user) return dispatch(logout(null));
            const { displayName, email, photoURL, uid } = user;
            dispatch(
                login({
                    uid: uid!,
                    email: email!,
                    photoUrl: photoURL!,
                    displayName: displayName!,
                })
            );
            dispatch(startLoadingNotes());
        });
    }, []);

    return {
        status,
    };
};
