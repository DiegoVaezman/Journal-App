import { Google } from '@mui/icons-material';
import {
    Alert,
    Button,
    Grid,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { FormValidations, useAppDispatch, useForm } from '../../hooks';
import { AuthLayout } from '../layout/AuthLayout';
import { useEffect, useState, useMemo } from 'react';
import { startCreatingUserWithEmailPassword } from '../../store/auth';
import { useAppSelector } from '../../hooks/redux-toolkit';

const formData = {
    email: '',
    password: '',
    displayName: '',
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
    displayName: [
        (value: string) => value.length >= 1,
        'El nombre es obligatorio',
    ],
};

export const RegisterPage = () => {
    const dispatch = useAppDispatch();
    const { status, errorMessage } = useAppSelector((state) => state.auth);
    const isAuthenticating = useMemo(() => status === 'checking', [status]);
    const {
        displayName,
        email,
        password,
        onInputChange,
        formState,
        formValidation,
        isFormValid,
    } = useForm(formData, formValidations);

    const [formSubmitted, setFormSubmitted] = useState(false);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormSubmitted(true);
        if (!isFormValid) return;

        dispatch(startCreatingUserWithEmailPassword(formState));
    };
    return (
        <AuthLayout title='Registro'>
            <form
                onSubmit={onSubmit}
                className='animate__animated animate__fadeIn animate__faster'
            >
                <Grid container>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField
                            label='Nombre completo'
                            type='text'
                            placeholder='Nombre'
                            fullWidth
                            name='displayName'
                            value={displayName}
                            onChange={onInputChange}
                            error={
                                !!formValidation.displayNameValid &&
                                formSubmitted
                            }
                            helperText={
                                formSubmitted && formValidation.displayNameValid
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField
                            label='Correo'
                            type='email'
                            placeholder='Correo'
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
                    <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
                        <Grid
                            item
                            xs={12}
                            display={!!errorMessage ? '' : 'none'}
                        >
                            <Alert severity='error'>{errorMessage}</Alert>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant='contained'
                                fullWidth
                                type='submit'
                                disabled={isAuthenticating}
                            >
                                Crear cuenta
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container direction='row' justifyContent='end'>
                        <Typography sx={{ mr: 1 }}>
                            ¿Ya tienes una cuenta?
                        </Typography>
                        <Link
                            color='inherit'
                            to='/auth/login'
                            component={RouterLink}
                        >
                            Login
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </AuthLayout>
    );
};
