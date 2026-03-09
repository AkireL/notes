
import { Note } from "./note";

const KEY_STORAGE = "libreta_notes";

export function saveToStorage(notes: Note[]): void {
    if (notes === undefined || notes === null || notes.length === 0) {
        console.log("No hay notas para guardar en el almacenamiento.");
        return;
    }
    localStorage.setItem(KEY_STORAGE, JSON.stringify(notes));
}

export function loadFromStorage(): Note[] {
    let notes = localStorage.getItem(KEY_STORAGE);

    notes = JSON.parse(notes ?? '[]');

    if (Array.isArray(notes)) {
        return notes;
    }

    return [];
}