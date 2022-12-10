import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore/lite';
import { FirebaseDB } from '../../firebase/config';
import { fileUpload, loadNotes } from '../../helpers';
import { AppDispatch, RootState } from '../store';
import { addNewEmptyNote, deleteNoteById, Note, savingNewNote, setActiveNote, setNotes, setPhotosToActiveNote, setSaving, updateNote,} from './journalSlice';


export const startNewNote = () => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(savingNewNote());
        const {uid} = getState().auth;

        //type Record<satring, any> hace que al objeto se le pueda añadir más propertis con key string y value any
        //type Omit<Interface, 'key'> omite la property del interface
        const newNote: Omit<Note, 'id'> = {
            title: '',
            body: '',
            date: new Date().getTime(),
            imageUrls: []
        };

        const newDoc = doc(collection(FirebaseDB, `${uid}/journal/notes`));
        await setDoc(newDoc, newNote);

        const note: Note = {
            ...newNote,
            id: newDoc.id
        };
        dispatch(addNewEmptyNote(note));
        dispatch(setActiveNote(note));
    };
}

export const startLoadingNotes = () => {
    return  async (dispatch: AppDispatch, getState: () => RootState) => {
        const {uid} = getState().auth;
        if (!uid) throw new Error('User uid not stablished');
        const notes = await loadNotes(uid);
        dispatch(setNotes(notes));
    };
}

export const startSaveNote = () => {
    return  async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(setSaving());
        const {uid} = getState().auth;
        const {active: note} = getState().journal;

        const noteToFireStore = {...note}
        delete noteToFireStore.id;
        
        const docRef = doc(FirebaseDB, `${uid}/journal/notes/${note!.id}`);
        //option merge:true hace que si en db hay algun campo que no contempla la nueva nota a actualizar se mantienen.
        await setDoc(docRef, noteToFireStore, {merge: true});

        dispatch(updateNote(note!));
    };
}

export const startUploadingFiles = (files: FileList) => {
    return  async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(setSaving());
        
        // await fileUpload(files[0]);
        const fileUploadPromises = [];
        for (const file of files) {
            fileUploadPromises.push(fileUpload(file));
        }
        const photosUrl = await Promise.all(fileUploadPromises);
        dispatch(setPhotosToActiveNote(photosUrl));
    };
}

export const startDeletingNote = (id: string) => {
    return  async (dispatch: AppDispatch, getState: () => RootState) => {
        const {uid} = getState().auth;
        const docRef = doc(FirebaseDB, `${uid}/journal/notes/${id}`);
        await deleteDoc(docRef);
        dispatch(deleteNoteById(id));
    };
}