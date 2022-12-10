import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { FirebaseAuth } from './config';

export type SignInWithGoogleType = () => Promise<AuthResponse>

export type RegisterWithEmailPasswordType = ({}:RegisterWithEmailPasswordProps) => Promise<AuthResponse>
export interface RegisterWithEmailPasswordProps {
    email: string;
    password: string;
    displayName: string;
}
export type LoginWithEmailPasswordType = ({}:LoginWithEmailPasswordProps) => Promise<AuthResponse>
export interface LoginWithEmailPasswordProps {
    email: string;
    password: string;
}
export interface AuthResponse {
    ok: boolean;
    displayName?: string | null;
    email?: string | null;
    photoUrl?: string | null;
    uid?: string | null;
    errorMessage?: string | null;
}



const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle: SignInWithGoogleType = async ()=> {
    try {
        const firebaseResult = await signInWithPopup(FirebaseAuth, googleProvider);
        // const credentials = GoogleAuthProvider.credentialFromResult(result);
        const {displayName, email, photoURL, uid} = firebaseResult.user;
        
        return {
            ok: true,
            displayName,
            email,
            photoUrl: photoURL,
            uid,
        }

    } catch (error) {
        console.log(error);
        let errorMessage = 'Unexpected error';
        if (error instanceof FirebaseError) {
            const errorCode = error.code;
            errorMessage = error.message;
        }
        return {
            ok: false,
            errorMessage,
        }
    }
}

export const registerWithEmailPassword: RegisterWithEmailPasswordType = async ({email, password, displayName}) => {
    try {
        const firebaseResult = await createUserWithEmailAndPassword(FirebaseAuth, email, password);
        const {uid, photoURL} = firebaseResult.user;
        await updateProfile(FirebaseAuth.currentUser!, {displayName});
        return {
            ok: true, 
            uid,
            displayName,
            email,
            photoUrl: photoURL,
        }
    } catch (error) {
        console.log(error);
        let errorMessage = 'Unexpected error';
        if (error instanceof FirebaseError) {
            const errorCode = error.code;
            errorMessage = error.message;
        }
        return {
            ok: false, 
            errorMessage,
        }
    }
}

export const loginWithEmailPassword: LoginWithEmailPasswordType = async ({email: mail, password}) => {
    try{
    const firebaseResult = await signInWithEmailAndPassword(FirebaseAuth, mail, password);
    const {displayName, email, photoURL, uid} = firebaseResult.user;
    return {
            ok: true,
            displayName,
            email,
            photoUrl: photoURL,
            uid,
        }

    } catch (error) {
        console.log(error);
        let errorMessage = 'Unexpected error';
        if (error instanceof FirebaseError) {
            const errorCode = error.code;
            errorMessage = error.message;
        }
        return {
            ok: false,
            errorMessage,
        }
    }
}

export const logoutFirebase = async () => {
    return await FirebaseAuth.signOut();
}