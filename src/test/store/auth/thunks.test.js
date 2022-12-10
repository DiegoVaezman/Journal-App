import {
    loginWithEmailPassword,
    logoutFirebase,
    registerWithEmailPassword,
    signInWithGoogle,
} from '../../../firebase/providers';
import { checkingCredentials, login, logout } from '../../../store/auth';
import {
    checkingAuthentication,
    startCreatingUserWithEmailPassword,
    startGoogleSignIn,
    startLoginWithEmailPassword,
    startLogout,
} from '../../../store/auth/thunks';
import { clearNotesLogout } from '../../../store/journal';
import { demoUser } from '../../fixtures/authFixtures';
jest.mock('../../../firebase/providers');

describe('Testing auth thunks', () => {
    const dispatch = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    test('should invoke checkingCreentials', async () => {
        await checkingAuthentication()(dispatch);
        expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
    });

    test('should startGoogleSignIn call checkingCredentials and login success', async () => {
        const googleSignInResponse = {
            ...demoUser,
            ok: true,
        };
        const loginData = { ...demoUser };
        //signinwithgoogle ya es un mock porque se ha establecido el mock del path de providers de firebase.
        await signInWithGoogle.mockResolvedValue(googleSignInResponse);
        await startGoogleSignIn()(dispatch);

        expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
        expect(dispatch).toHaveBeenCalledWith(login(loginData));
    });

    test('should startGoogleSignIn call checkingCredentials and login error', async () => {
        const errorMessage = 'Unexpected error';
        const googleSignInResponse = {
            ok: false,
            errorMessage,
        };

        await signInWithGoogle.mockResolvedValue(googleSignInResponse);
        await startGoogleSignIn()(dispatch);

        expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
        expect(dispatch).toHaveBeenCalledWith(logout(errorMessage));
    });

    test('should StartLoginWithEmailPassword call checkingCredentials and login success', async () => {
        const firebaseProviderLoginResponse = {
            ok: true,
            ...demoUser,
        };
        const loginData = { ...demoUser };
        const formData = { email: demoUser.email, password: '123456' };
        await loginWithEmailPassword.mockResolvedValue(
            firebaseProviderLoginResponse
        );

        await startLoginWithEmailPassword(formData)(dispatch);

        expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
        expect(dispatch).toHaveBeenCalledWith(login(loginData));
    });

    test('should StartLoginWithEmailPassword call checkingCredentials and login error', async () => {
        const errorMessage = 'Unexpected error';
        const firebaseProviderLoginResponse = {
            ok: false,
            errorMessage,
        };
        const formData = { email: demoUser.email, password: '123456' };
        await loginWithEmailPassword.mockResolvedValue(
            firebaseProviderLoginResponse
        );

        await startLoginWithEmailPassword(formData)(dispatch);

        expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
        expect(dispatch).toHaveBeenCalledWith(logout(errorMessage));
    });

    test('should startCreatingUserWithEmailPassword call checkingCredentials and login success', async () => {
        const firebaseProviderCreateUserResponse = {
            ok: true,
            ...demoUser,
        };
        const loginData = { ...demoUser };
        const formData = {
            email: demoUser.email,
            password: '123456',
            displayName: demoUser.displayName,
        };
        await registerWithEmailPassword.mockResolvedValue(
            firebaseProviderCreateUserResponse
        );

        await startCreatingUserWithEmailPassword(formData)(dispatch);

        expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
        expect(dispatch).toHaveBeenCalledWith(login(loginData));
    });

    test('should startCreatingUserWithEmailPassword call checkingCredentials and login error', async () => {
        const errorMessage = 'Unexpected error';
        const firebaseProviderCreateUserResponse = {
            ok: false,
            errorMessage,
        };
        const formData = { email: demoUser.email, password: '123456' };
        await registerWithEmailPassword.mockResolvedValue(
            firebaseProviderCreateUserResponse
        );

        await startCreatingUserWithEmailPassword(formData)(dispatch);

        expect(dispatch).toHaveBeenCalledWith(checkingCredentials());
        expect(dispatch).toHaveBeenCalledWith(logout(errorMessage));
    });

    test('should call logoutFirebase, clearNotes and logout', async () => {
        await startLogout()(dispatch);

        expect(logoutFirebase).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalledWith(clearNotesLogout());
        expect(dispatch).toHaveBeenCalledWith(logout(null));
    });
});
