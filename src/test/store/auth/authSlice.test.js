import {
    authSlice,
    checkingCredentials,
    login,
    logout,
} from '../../../store/auth/authSlice';
import {
    demoUser,
    initialState,
    authenticatedState,
} from '../../fixtures/authFixtures';

describe('Testing authSlice', () => {
    test('should return initial state and call auth', () => {
        const state = authSlice.reducer(initialState, {});

        expect(authSlice.name).toBe('auth');
        expect(state).toEqual(initialState);
    });

    test('should do authentication', () => {
        const state = authSlice.reducer(initialState, login(demoUser));
        expect(state).toEqual({
            status: 'authenticated',
            uid: demoUser.uid,
            email: demoUser.email,
            displayName: demoUser.displayName,
            photoUrl: demoUser.photoUrl,
            errorMessage: null,
        });
    });

    test('should do logout without arguments', () => {
        const state = authSlice.reducer(authenticatedState, logout(null));
        expect(state).toEqual({
            status: 'not-authenticated',
            uid: null,
            email: null,
            displayName: null,
            photoUrl: null,
            errorMessage: null,
        });
    });

    test('should do logout and show error message', () => {
        const errorMessage = 'Incorrect credentials';
        const state = authSlice.reducer(
            authenticatedState,
            logout(errorMessage)
        );
        expect(state).toEqual({
            status: 'not-authenticated',
            uid: null,
            email: null,
            displayName: null,
            photoUrl: null,
            errorMessage: errorMessage,
        });
    });

    test('should change state to checking', () => {
        const state = authSlice.reducer(
            authenticatedState,
            checkingCredentials()
        );
        expect(state.status).toBe('checking');
    });
});
