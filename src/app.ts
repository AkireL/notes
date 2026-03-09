import { Libreta, type Store } from "./note";
import { formatUnicode } from "./string";
import { showMessage } from "./messages";
import { renderNoteList, renderEditor, renderPreview } from "./render.js";

let currentNoteId: null| undefined| number = null;

/**
 * Oculta el editor y el preview
 */
function hideEditorAndPreview() {
  const editorSection = document.querySelector<HTMLElement>('#editor-section');
  const previewSection = document.querySelector<HTMLElement>('#preview-section');

  if (!editorSection || !previewSection) return;

  editorSection.style.display = 'none';
  previewSection.style.display = 'none';
}


/**
 * Inicitaliza todos los events listeners de la aplicación
 * @param {Object} store - Store de notas
 */
function initializeEventLIsteners(store: Store) {
    const newNoteButton = document.querySelector<HTMLElement>('#new-note-button');

    if (!newNoteButton) return;

    newNoteButton.addEventListener('click', () => {
        currentNoteId = null;
        renderEditor(null);
    });

    const saveNoteButton = document.querySelector<HTMLElement>('#save-note-button');

    if (!saveNoteButton) return;

    saveNoteButton.addEventListener('click', () => {
        const editorTextArea = document.querySelector<HTMLTextAreaElement>('#editor-textarea');
        if (!editorTextArea) return;

        const content = editorTextArea.value;

        if (content.trim() === '') {
            showMessage('El contenido no puede estar vacío', true);
            return;
        }

        if (currentNoteId != null) {
            const result = store.updateNote(Number(currentNoteId), { content: content });

            if (result.success === true) {
                showMessage('Nota actualizada Exitosamente', false);
                const notes = store.getNotesOrderedByDate();
                renderNoteList(notes, Number(currentNoteId));
            } else {
                showMessage(result.message ?? '', true);
            }
        } else {
            const result = store.addNote('', content);

            if (result.success === true) {
                showMessage('Nota creada exitosamente', false);
                currentNoteId = Number(result?.note?.id);
                const notes = store.getNotesOrderedByDate();
                renderNoteList(notes, currentNoteId);
            } else {
                showMessage(result.message ?? '', true);
            }
        }
    });

    const deleteNoteButton = document.querySelector<HTMLElement>('#delete-note-button');

    if (!deleteNoteButton) return;

    deleteNoteButton.addEventListener('click', () => {
        if (currentNoteId === null) {
            showMessage('No hay una nota seleccionada para eliminar', true);
            return;
        }

        const confirmed = confirm('¿Estás seguro de eliminar esta nota?');

        if (confirmed === true) {
            const result = store.deleteNote(Number(currentNoteId));

            if (result.success === false) {
                showMessage(result.message ?? '', true);
                return;
            }

            showMessage('Nota Eliminada exitosamente', false);
            hideEditorAndPreview();
            currentNoteId = null;
            const notes = store.getNotesOrderedByDate();
            renderNoteList(notes, Number(currentNoteId));
        }
    });

    const editorTextarea = document.querySelector<HTMLTextAreaElement>('#editor-textarea');

    if (!editorTextarea) return;

    editorTextarea.addEventListener('input', () => {
        const content = editorTextarea.value;
        renderPreview(content);
    });

    const noteListContainer = document.querySelector<HTMLElement>('#note-list');

    if (!noteListContainer) return;

    noteListContainer.addEventListener('click', (event) => {
        const target = event.target as Element;
        const noteItem = target.closest('.note-item');

        if (noteItem != null) {
            const noteId = Number((noteItem as HTMLElement).dataset.id);
            const note = store.getNoteById(noteId);

            if (note != null) {
                currentNoteId = Number(note.id);
                renderEditor(note);
                const notes = store.getNotesOrderedByDate();
                renderNoteList(notes, currentNoteId);
            }
        }
    });

    // copy to LinkedIn
    const unicodeButton = document.querySelector<HTMLButtonElement>("#copy-unicode-button");
    
    if (!unicodeButton) return;

    unicodeButton.addEventListener("click", async (event) => {
        const button = event.currentTarget as HTMLButtonElement;
        button.disabled = true;

        const editorTextArea = document.querySelector<HTMLTextAreaElement>('#editor-textarea');
        
        if (!editorTextArea) {
            showMessage('Editor no encontrado', true);
            button.disabled = false;
            return;
        }
        
        const content = editorTextArea.value;

        if (content.trim() === '') {
            showMessage('El contenido no puede estar vacío', true);
            button.disabled = false;
            return;
        }

        const texto = formatUnicode(content);
        
        await navigator.clipboard.writeText(texto);
        showMessage("Texto copiado 🚀", false);

        setTimeout(() => {
            button.disabled = false;
        }, 2000);
    });
}


function initialzeApp() {
  const store = Libreta();
  const notes = store.getNotesOrderedByDate();
  renderNoteList(notes, Number(currentNoteId));

  hideEditorAndPreview();

  initializeEventLIsteners(store);

  console.log('Aplicación inicializada correctamente');
  console.log('Total de notas cargadas:', store.countNotes());
}

document.addEventListener('DOMContentLoaded', () => {
  initialzeApp();
});