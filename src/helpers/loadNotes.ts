import { collection, getDocs } from 'firebase/firestore/lite';
import { FirebaseDB } from '../firebase/config';
import { Note } from '../store/journal';


export const loadNotes = async (uid: string) => {
    if (!uid) throw new Error ('User uid not stablished');

    const collectionRef = collection(FirebaseDB, `${uid}/journal/notes`);
    const docs = await getDocs(collectionRef);

    const notes: Note[] = [];
    docs.forEach(doc => {
        const note = {
            id: doc.id,
            ...doc.data() as Omit<Note, 'id'>
        }
        notes.push(note);
    });
    return notes;
    
}