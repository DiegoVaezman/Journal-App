import { collection, deleteDoc, getDocs } from 'firebase/firestore/lite';
import { FirebaseDB } from '../../../firebase/config';
import {
    addNewEmptyNote,
    savingNewNote,
    setActiveNote,
    startNewNote,
} from '../../../store/journal';

describe('Testin journal tunks', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    test('should create new note', async () => {
        const uid = 'testuid';
        getState.mockReturnValue({ auth: { uid } });
        await startNewNote()(dispatch, getState);

        const note = {
            id: expect.any(String),
            body: '',
            title: '',
            imageUrls: [],
            date: expect.any(Number),
        };
        expect(dispatch).toHaveBeenCalledWith(savingNewNote());
        expect(dispatch).toHaveBeenCalledWith(addNewEmptyNote(note));
        expect(dispatch).toHaveBeenCalledWith(setActiveNote(note));

        //Borrar de firebase
        const collectionRef = collection(FirebaseDB, `${uid}/journal/notes`);
        const docs = await getDocs(collectionRef);
        const deletePromises = [];
        docs.forEach((doc) => deletePromises.push(deleteDoc(doc.ref)));

        await Promise.all(deletePromises);
    });
});
