function loadComponent(selector, path) {
  fetch(path)
    .then(response => response.text())
    .then(html => {
      document.querySelector(selector).innerHTML = html;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "src/components/header.html");
  loadComponent("footer", "src/components/footer.html");
});
