import { navigateTo } from "/src/scripts/router.js";

const loginButton = document.getElementById("loginBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const generalError = document.getElementById("generalError");

loginButton.addEventListener("click", async (event) => {
  event.preventDefault();
  emailError.textContent = "";
  passwordError.textContent = "";
  generalError.textContent = "";

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    generalError.textContent = "Необходимо заполнить все поля.";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    emailError.textContent = "Введите корректный email-адрес.";
    return;
  }

  if (password.length < 8) {
    passwordError.textContent = "Пароль должен содержать минимум 8 символов.";
    return;
  }

  try {
    const response = await fetch("https://blog.kreosoft.space/api/account/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        navigateTo("/"); 
      } else {
        generalError.textContent = "Ошибка: токен авторизации не получен.";
      }
    } else if (response.status === 400) {
      generalError.textContent = "Неверный логин или пароль.";
    } else if (response.status === 500) {
      generalError.textContent = "Внутренняя ошибка сервера. Попробуйте позже.";
    } else {
      generalError.textContent = "Что-то пошло не так. Попробуйте снова.";
    }
  } catch (error) {
    generalError.textContent = "Проблема с подключением. Проверьте интернет.";
  }
});
