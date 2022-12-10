import { useMemo, useState } from 'react';
import {
    startGoogleSignIn,
    startLoginWithEmailPassword,
} from '../../store/auth';
import { Link as RouterLink } from 'react-router-dom';
import Google from '@mui/icons-material/Google';
import {
    Alert,
    Button,
    Grid,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import {
    FormValidations,
    useAppDispatch,
    useAppSelector,
    useForm,
} from '../../hooks';
import { AuthLayout } from '../layout/AuthLayout';

const formData = {
    email: '',
    password: '',
};

const formValidations: FormValidations = {
    email: [
        (value: string) => value.includes('@'),
        'El email debe de tener un @',
    ],
    password: [
        (value: string) => value.length >= 6,
        'El password debe tener más de 6 caracteres',
    ],
};

export const LoginPage = () => {
    const { status, errorMessage } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const { email, password, onInputChange, formValidation, isFormValid } =
        useForm(formData, formValidations);
    const isAuthenticating = useMemo(() => status === 'checking', [status]);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormSubmitted(true);
        if (!isFormValid) return;
        dispatch(startLoginWithEmailPassword({ email, password }));
    };

    const onGooleSignIn = () => {
        dispatch(startGoogleSignIn());
    };

    function invertirTexto(string = 'Este es un TEXTO de prueba') {
        return string.split('').reverse().join('');
    }

    return (
        <AuthLayout title='Login'>
            <form
                aria-label='form'
                onSubmit={onSubmit}
                className='animate__animated animate__fadeIn animate__faster'
            >
                <Grid container>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField
                            label='Correo'
                            type='email'
                            placeholder='correo@gmail.com'
                            fullWidth
                            name='email'
                            value={email}
                            onChange={onInputChange}
                            error={!!formValidation.emailValid && formSubmitted}
                            helperText={
                                formSubmitted && formValidation.emailValid
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField
                            label='Contraseña'
                            type='password'
                            placeholder='Contraseña'
                            fullWidth
                            name='password'
                            inputProps={{
                                'data-testid': 'password',
                            }}
                            value={password}
                            onChange={onInputChange}
                            error={
                                !!formValidation.passwordValid && formSubmitted
                            }
                            helperText={
                                formSubmitted && formValidation.passwordValid
                            }
                        />
                    </Grid>
                    <Grid
                        container
                        display={!!errorMessage ? '' : 'none'}
                        sx={{ mt: 1 }}
                    >
                        <Grid item xs={12}>
                            <Alert severity='error'>{errorMessage}</Alert>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <Button
                                variant='contained'
                                fullWidth
                                type='submit'
                                disabled={isAuthenticating}
                            >
                                Login
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                aria-label='google-btn'
                                variant='contained'
                                fullWidth
                                onClick={onGooleSignIn}
                                disabled={isAuthenticating}
                            >
                                <Google />
                                <Typography sx={{ ml: 1 }}>Google</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container direction='row' justifyContent='end'>
                        <Link
                            color='inherit'
                            to='/auth/register'
                            component={RouterLink}
                        >
                            Crear una cuenta
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </AuthLayout>
    );
};
