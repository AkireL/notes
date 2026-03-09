
/**
 * Muestra un mensaje de error o éxito
 * @param {string} message - Mensaje a mostrar
 * @param {boolean} isError - true si es error, false si es éxito
 */
export function showMessage(message: string, isError: boolean) {
  const messageContainer = document.querySelector('#message-container');
  
  if (!messageContainer) return;

  messageContainer.textContent = message;

  if (isError === true) {
    messageContainer.className = 'message error';
  } else {
    messageContainer.className = 'message success';
  }

  setTimeout(() => {
    messageContainer.textContent = '';
    messageContainer.className = 'message';
  }, 3000);
}