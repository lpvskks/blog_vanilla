export function showFull(descriptionElement, fullText, maxLength = 200) {
  const truncatedText = fullText.length > maxLength ? fullText.slice(0, maxLength) + '...' : fullText;

  descriptionElement.textContent = truncatedText;
  const showButton = descriptionElement.nextElementSibling; 
  if (fullText.length > maxLength) {
    showButton.classList.remove('d-none');
  }

  showButton.addEventListener('click', () => {
    if (descriptionElement.textContent === truncatedText) {
      descriptionElement.textContent = fullText; 
      showButton.textContent = 'Скрыть'; 
    } else {
      descriptionElement.textContent = truncatedText; 
      showButton.textContent = 'Показать все'; 
    }
  });
}