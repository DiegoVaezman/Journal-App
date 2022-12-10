import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { TextRotateUp } from '@mui/icons-material';

export interface JournalState {
    isSaving: boolean;
    messageSaved: string;
    notes: Note[];
    active: Note | null;
}
export interface Note {
    id: string;
    title: string;
    body: string;
    date: number;
    imageUrls: string[];
}

const initialState: JournalState = {
    isSaving: false,
    messageSaved: '',
    notes: [],
    active: null,
}

export const journalSlice = createSlice({
    name: 'journal',
    initialState,
    //en los reducers deben ir funciones síncronas puras. Para las funciones asíncronas utilizar los thunks.
    reducers: {
        savingNewNote: (state ) => {
            state.isSaving = true;
        },
        addNewEmptyNote: (state, action: PayloadAction<Note> ) => {
            state.notes.push(action.payload);
            state.isSaving = false;
        },
        setActiveNote: (state, action: PayloadAction<Note> ) => {
            state.active = action.payload;
            state.messageSaved = '';
        },
        setNotes: (state, action: PayloadAction<Note[]> ) => {
            state.notes = action.payload;
        },
        setSaving: (state ) => {
            state.isSaving = true;
            state.messageSaved = '';
        },
        updateNote: (state, action: PayloadAction<Note> ) => {
            state.isSaving = false;
            state.notes = state.notes.map(note => {
                if (note.id === action.payload.id) {
                    return action.payload;
                };
                return note;
            });
            state.messageSaved = `Nota "${action.payload.title}", actualizada correctamente`
        },
        setPhotosToActiveNote: (state, action: PayloadAction<string[]> ) => {
            state.active!.imageUrls = [...state.active!.imageUrls, ...action.payload];
            state.isSaving = false;
        }, 
        deleteNoteById: (state, action: PayloadAction<string> ) => {
            state.active = null;
            state.notes = state.notes.filter(note => note.id != action.payload);
        },
        clearNotesLogout: (state) => {
            state.isSaving = false,
            state.messageSaved = '',
            state.notes = [],
            state.active = null
            // state = initialState
        },

    }
});


export const { savingNewNote, addNewEmptyNote, setActiveNote, setNotes, setSaving, updateNote, deleteNoteById, setPhotosToActiveNote, clearNotesLogout} = journalSlice.actions;