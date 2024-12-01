import { navigateTo } from "/src/scripts/router.js";
import { updateHeader } from "/main.js";

const loginButton = document.getElementById("loginBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const error = document.getElementById("error");

loginButton.addEventListener("click", async (event) => {
  event.preventDefault();
  emailError.textContent = "";
  passwordError.textContent = "";
  error.textContent = "";

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    error.textContent = "Необходимо заполнить все поля.";
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
        localStorage.setItem("userEmail", email);
        updateHeader();
        successMessage.classList.remove("d-none");

        setTimeout(() => {
          navigateTo("/"); 
        }, 1000); 
      }  else {
        error.textContent = "Ошибка: токен авторизации не получен.";
      }
    } else if (response.status === 400) {
      error.textContent = "Неверный логин или пароль.";
    } else if (response.status === 500) {
      error.textContent = "Внутренняя ошибка сервера. Попробуйте позже.";
    } else {
      error.textContent = "Что-то пошло не так. Попробуйте снова.";
    }
  } catch (error) {
    error.textContent = "Проблема с подключением. Проверьте интернет.";
  }
});
