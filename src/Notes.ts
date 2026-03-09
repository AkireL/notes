import { isEmpty, deriveTitle, truncateContent } from "./Strings";
import { saveToStorage, loadFromStorage } from "./storage";

function generateId():number {
    return Date.now();
}

type NoteResponse = {
    success: boolean;
    message?: string;
    note?: Note;
}

export type Store = {
    addNote: (title: string, content: string) => NoteResponse;
    getNotesOrderedByDate: () => Note[];
    getNoteById: (id: number) => Note | null;
    updateNote: (id: number, updates: { content?: string; title?: string }) => NoteResponse;
    deleteNote: (id: number | null | undefined | string) => NoteResponse;
    countNotes: () => number;
};

export class Note {
    id: number;
    title: string;
    content: string;
    resume: string;
    createdAt: number;
    updatedAt: number;

    constructor(title: string, content: string, resume: string, createdAt: number, updatedAt: number) {
        this.id = generateId();
        this.title = title;
        this.content = content.trim();
        this.resume = resume;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export function Libreta(): Store {
    let notes = loadFromStorage();

    function addNote(title: string = '', content: string): NoteResponse {
        const trimmedContent = content.trim();
        if (trimmedContent === "") {
            return {success: false, message: "Error: El contenido no puede estar vacio."}
        }

        let currentTime = Date.now();
        let resume = truncateContent(trimmedContent);

        let noteTitle = title;
        if (noteTitle === undefined || noteTitle === null || noteTitle === '') {
            noteTitle = deriveTitle(content);
        }

        let newNote = new Note(
            noteTitle,
            trimmedContent,
            resume,
            currentTime,
            currentTime,
        )

        notes.push(newNote);
        saveToStorage(notes);

        return { success: true, note: newNote };
    }

    function getNotesOrderedByDate(): Note[] {
        return notes;
    }

    function getNoteById(id: number): Note | null {
        if (isEmpty(id)) {
            console.log("ID no puede estar vacio");
            return null;
        }

        return notes.find(note => note.id === id) ?? null; 
    }

    function updateNote(id: number, updates: { content?: string; title?: string }): NoteResponse {
        if (isEmpty(id)) {
            return { success: false, message: 'ID no puede estar vacio' };
        }

        const note = getNoteById(id);

        if (!note) {
            return { success: false, message: 'Nota no encontrada' };
        }

        if (! isEmpty(updates.content)) {
            const trimmedContent = updates?.content?.trim();

            if (isEmpty(trimmedContent)) {
                return { success: false, message: 'El contenido no puede estar vacío' };
            }

            note.content = trimmedContent ?? '';
            note.resume = truncateContent(note.content);
            note.title = deriveTitle(trimmedContent);
        }

        if (! isEmpty(updates.title)) {
            note.title = updates.title ?? '';
        }

        note.updatedAt = Date.now();

        const noteIndex = notes.findIndex(note => note.id === id);
        notes[noteIndex] = { ...note };
        saveToStorage(notes);

        return { success: true, note: note };
    }

    function deleteNote(id: number | null | undefined | string): NoteResponse{
        if (isEmpty(id)) {
            return {success: false, message: "ID no puede estar vacio"};
        }

        const noteIndex = notes.findIndex(note => note.id === id);

        if (noteIndex === -1) {
            return { success: false, message: "Nota no encontrada" };
        }

        notes.splice(noteIndex, 1);
        saveToStorage(notes);

        return { success: true, message: "Nota eliminada exitosamente" };
    }

    function countNotes(): number {
        return notes.length;
    }

    return { addNote, getNotesOrderedByDate, getNoteById, updateNote, deleteNote, countNotes };
}



