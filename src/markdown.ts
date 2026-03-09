declare global {
  interface Window {
    markdownit: any;
  }
}

/**
 * Función para hacer render del Markdown
 * @param {String} content - El contenido de l anota
 */
export function renderMarkdown(content: string): string {
  if (typeof window.markdownit != 'undefined') {
    const md = window.markdownit();
    return md.render(content);
  }
  return content;
}