import {
    DeleteOutline,
    SaveOutlined,
    UploadOutlined,
} from '@mui/icons-material';
import { Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import { useForm } from '../../hooks';
import { ImageGalery } from '../components';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-toolkit';
import { useMemo, useEffect, useRef, useCallback } from 'react';
import {
    Note,
    setActiveNote,
    startDeletingNote,
    startSaveNote,
    startUploadingFiles,
} from '../../store/journal';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

export const NoteView = () => {
    const {
        active: note,
        notes,
        messageSaved,
        isSaving,
    } = useAppSelector((state) => state.journal);
    const dispatch = useAppDispatch();

    const { body, title, date, onInputChange, formState } = useForm(note!);

    const dateString = useMemo(() => {
        const noteDate = new Date(date);
        return `${noteDate.getDate()}/${noteDate.getMonth()}/${noteDate.getFullYear()}`;
    }, [date]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        dispatch(setActiveNote(formState as Note));
    }, [formState]);

    useEffect(() => {
        if (messageSaved.length > 0) {
            Swal.fire('Nota actualizada', messageSaved, 'success');
        }
    }, [messageSaved]);

    const onSaveNote = () => {
        dispatch(startSaveNote());
    };

    const onFileInputChange = ({
        target,
    }: React.ChangeEvent<HTMLInputElement>) => {
        if (target.files?.length === 0) return;
        dispatch(startUploadingFiles(target.files!));
        target.value = '';
    };

    const originalNote = useMemo(() => {
        return notes.find((n) => n.id === note!.id);
    }, [note!.id, notes]);

    const isChanged = useMemo(() => {
        return JSON.stringify(originalNote) !== JSON.stringify(note);
    }, [note, notes]);

    const onDelete = () => {
        dispatch(startDeletingNote(note!.id));
    };

    return (
        <Grid
            className='animate__animated animate__fadeIn animate__faster'
            container
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            sx={{ mb: 1 }}
        >
            <Grid item>
                <Typography fontSize={30} fontWeight='light'>
                    {dateString}
                </Typography>
            </Grid>
            <Grid item>
                <input
                    ref={fileInputRef}
                    type='file'
                    multiple
                    onChange={onFileInputChange}
                    style={{ display: 'none' }}
                />
                <IconButton
                    color='primary'
                    disabled={isSaving}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <UploadOutlined />
                </IconButton>
                <Button
                    color='primary'
                    sx={{ padding: 2 }}
                    onClick={onSaveNote}
                    disabled={isSaving || !isChanged}
                >
                    <SaveOutlined sx={{ fontSize: 30, mr: 1 }} />
                    Guardar
                </Button>
            </Grid>
            <Grid container>
                <TextField
                    type='text'
                    variant='filled'
                    fullWidth
                    placeholder='Ingrese un título'
                    label='Título'
                    sx={{ border: 'none', mb: 1 }}
                    name='title'
                    value={title}
                    onChange={onInputChange}
                />
                <TextField
                    type='text'
                    variant='filled'
                    fullWidth
                    multiline
                    placeholder='¿Qué sucedió en el día de hoy?'
                    label='Nota'
                    minRows={5}
                    name='body'
                    value={body}
                    onChange={onInputChange}
                />
            </Grid>

            <Grid container justifyContent='end'>
                <Button onClick={onDelete} sx={{ mt: 2 }} color='error'>
                    <DeleteOutline />
                </Button>
            </Grid>

            <ImageGalery images={note!.imageUrls} />
        </Grid>
    );
};
