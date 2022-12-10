import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../../../auth/pages/LoginPage';
import { authSlice, login } from '../../../store/auth';
import { notAuthenticatedState } from '../../fixtures/authFixtures';

const mockStartGoogleSignIn = jest.fn();
const mockStartLoginWithEmailPassword = jest.fn();

jest.mock('../../../store/auth/thunks', () => ({
    startGoogleSignIn: () => mockStartGoogleSignIn,
    startLoginWithEmailPassword: ({ email, password }) =>
        mockStartLoginWithEmailPassword({ email, password }),
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch:
        () =>
        (fn = () => {}) =>
            fn(),
}));

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
    },
    preloadedState: {
        auth: notAuthenticatedState,
    },
});
describe('Testing LoginPage', () => {
    beforeEach(() => jest.clearAllMocks());

    test('should render component', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            </Provider>
        );
        // screen.debug();
        expect(screen.getAllByText('Login').length).toBeGreaterThanOrEqual(1);
    });

    test('should google button call onGoogleSignin and dispatch startGoogleSignIn', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            </Provider>
        );

        //el botón de google está desabilitado si iniciamos el provider con el authstate iniciar porque está en checking. Pero añadiendo preloadedState en la configuración del store de testing
        //con el estado notAuthenticated el botón de google estará disponible y se podrá hacer click.
        const googleBtn = screen.getByLabelText('google-btn');
        fireEvent.click(googleBtn);

        expect(mockStartGoogleSignIn).toHaveBeenCalled();
    });

    test('should submit call startLoginWithEmailPassword', () => {
        const email = 'email@email.com';
        const password = '123456';
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            </Provider>
        );

        const emailField = screen.getByRole('textbox', { name: 'Correo' });
        fireEvent.change(emailField, {
            target: { name: 'email', value: email },
        });

        //para tomar el password input no funciona con getByRole no se sabe porqué así que se le añade inputProps con data-testid en LoginPage para poder seleccionarlo
        const passwordField = screen.getByTestId('password');
        fireEvent.change(passwordField, {
            target: { name: 'password', value: password },
        });
        const loginForm = screen.getByLabelText('form');
        fireEvent.submit(loginForm);

        expect(mockStartLoginWithEmailPassword).toHaveBeenLastCalledWith({
            email,
            password,
        });
    });
});
