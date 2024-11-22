import { createHeader } from './components/header.js';
import { createFooter } from './components/footer.js';

function updateHeaderFooter() {
  const header = createHeader();
  const footer = createFooter();

  document.body.insertAdjacentElement('afterbegin', header);
  document.body.insertAdjacentElement('beforeend', footer);
}

window.addEventListener('popstate', updateHeaderFooter);

updateHeaderFooter();
