export function createFooter() {
  const footer = document.createElement('footer');
  footer.classList.add('bg-light', 'border-top', 'border-secondary', 'py-4');
  footer.innerHTML = `
    <div class="container d-flex justify-content-between align-items-center">
      <span class="text-secondary" style="font-size: 1rem;">© 2022 - Блог №415</span>
    </div>
  `;
  return footer;
}
