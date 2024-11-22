export function createHeader() {
  const header = document.createElement('header');
  header.classList.add('bg-white', 'shadow-sm', 'py-3');
  header.innerHTML = `
    <div class="container">
      <ul class="nav justify-content-between align-items-center p-0 m-0">
        <li class="nav-item d-flex align-items-center">
          <span class="h5 mb-0 me-4 fw-normal text-dark" style="font-size: 1.5rem;">Блог №415</span>
          <a href="/" class="nav-link text-dark text-decoration-none fw-normal p-0" style="font-size: 1.2rem;">Главная</a>
        </li>
        <li class="list-inline-item">
          <a href="/login" class="nav-link text-dark text-decoration-none fw-normal p-0" style="font-size: 1.2rem;">Вход</a>
        </li>
      </ul>
    </div>
  `;
  return header;
}
