
import { renderMarkdown } from "./markdown";
import { Note } from "./note";

/**
 * Muestra el textarea de editor y el preview
 */
function showEditorAndPreview() {
  const editorSection = document.querySelector<HTMLElement>('#editor-section');
  const previewSection = document.querySelector<HTMLElement>('#preview-section');

  if (!editorSection || !previewSection) return;

  editorSection.style.display = 'flex';
  previewSection.style.display = 'flex';
}

/**
 * Renderiza la lista de notas en el DOM
 * @param {Array} notes - Array de notas a renderizar
 */
export function renderNoteList(notes: Note[], currentNoteId: null | number) {
  const noteListContainer = document.querySelector('#note-list');

  if (!noteListContainer) return;

  noteListContainer.innerHTML = '';

  if (notes.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No hay notas. Crea tu primera nota.';
    emptyMessage.className = 'empty-message';
    noteListContainer.append(emptyMessage);
    return;
  }

  notes.forEach(function (note) {
    const noteItem = document.createElement('div');
    if (noteItem === null )return;

    noteItem.className = 'note-item';

    noteItem.dataset.id = String(note.id);

    if (currentNoteId === note.id) {
      noteItem.className = 'note-item active';
    }

    const noteTitle = document.createElement('h3');
    noteTitle.textContent = note.title;

    const noteExcerpt = document.createElement('p');
    noteExcerpt.textContent = note.resume;
    noteExcerpt.className = 'note-excerpt';

    const noteDate = document.createElement('small');
    const date = new Date(note.updatedAt);
    noteDate.textContent = date.toLocaleDateString();
    noteDate.className = 'note-date';

    noteItem.append(noteTitle);
    noteItem.append(noteExcerpt);
    noteItem.append(noteDate);

    noteListContainer.append(noteItem);
  });
}


/**
 * Renderiza el editor con el contenido de una nota
 * @param {Object|null} note - Nota a renderizar o null para editor vacío
 */
export function renderEditor(note: Note | null | undefined) {
    const editorTextarea = document.querySelector<HTMLTextAreaElement>('#editor-textarea');

    if (!editorTextarea) return;

    showEditorAndPreview();
    editorTextarea.value = '';

    if (note !== null && note !== undefined) {
        showEditorAndPreview();
        editorTextarea.value = note.content;
    } 

  renderPreview(editorTextarea.value);
}


/**
 * Renderiza el preview del contenido Markdown
 * @param {string} content - Contenido Markdown a renderizar
 */
export function renderPreview(content: string) {
  const previewContainer = document.querySelector('#preview-container');

  if (!previewContainer) return;

  previewContainer.innerHTML = '';

  if (content === '' || content === null || content === undefined) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'El preview aparecerá aquí...';
    emptyMessage.className = 'preview-empty';
    previewContainer.append(emptyMessage);
    return;
  }

  const html = renderMarkdown(content); 
  previewContainer.innerHTML = html;
}