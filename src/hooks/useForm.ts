import { useState, useEffect, useMemo } from 'react';

export type FormValidations = {[key: string]: [((value: string) => boolean), string]}
// export type FormValidations = {[key in T as string]: [((value: string) => boolean), string]}
export const useForm = <T extends Object>( initState: T, formValidations: FormValidations = {} as FormValidations ) => {
    
    const [formState, setFormState] = useState( initState );

    const [formValidation, setFormValidation] = useState({} as {[key: string]: string | null});

    useEffect(() => {
        createValidators();
    }, [formState]);

    useEffect(() => {
      setFormState(initState);
    }, [initState]);
    

    const isFormValid = useMemo(() => {
        for (const formValue of Object.keys(formValidation)) {
            if (formValidation[formValue] !== null) return false;
        }
        return true;
    }, [formValidation])
    

    const onInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [ name ]: value
        });
    }

    const onResetForm = () => {
        setFormState( initState );
    }

    const createValidators = () => {
        const formCheckedValues: {[key: string]: string | null}= {};
        for (const formField of Object.keys(formValidations)) {
            const [fn, errorMessage = 'Este campo es requerido'] = formValidations[formField];
            
            const p = formState[formField as keyof typeof formState]
            formCheckedValues[`${formField}Valid`] = fn(String(p)) ? null : errorMessage;
        }
        setFormValidation(formCheckedValues)
    }

    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,
        formValidation,
        isFormValid
    };
};