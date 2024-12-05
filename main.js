import { handleLogout } from "/src/scripts/logout.js"; 

async function loadComponent(selector, path) {
  try {
    const response = await fetch(path);
    const html = await response.text();
    document.querySelector(selector).innerHTML = html;
    updateHeader();

    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
      logoutButton.addEventListener("click", handleLogout);
    } else {
      console.error("Кнопка 'Выход' не найдена!");
    }
  } catch (error) {
    console.error(error);
  }
}

export async function updateHeader() {
  const token = localStorage.getItem("authToken");
  const email = localStorage.getItem("userEmail");

  const loginButton = document.getElementById("loginButton");
  const userDropdown = document.getElementById("userDropdown");
  const userEmail = document.getElementById("userEmail");

  if (token) {
    console.log("Токен найден, пользователь авторизован.");

    if (loginButton) loginButton.classList.add("d-none");
    if (userDropdown) userDropdown.classList.remove("d-none");

    if (userEmail && email) userEmail.textContent = email;
  } else {
    console.log("Токен не найден, пользователь не авторизован.");

    if (loginButton) loginButton.classList.remove("d-none");
    if (userDropdown) userDropdown.classList.add("d-none");
  }
};

loadComponent("header", "src/components/header.html");
loadComponent("footer", "src/components/footer.html");
