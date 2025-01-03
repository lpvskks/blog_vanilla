import { navigateTo } from "/src/scripts/router.js";

const registerBtn = document.getElementById("registerBtn");
const nameInput = document.getElementById("name");
const birthdateInput = document.getElementById("birthdate");
const genderInput = document.getElementById("gender");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const error = document.getElementById("error"); 

registerBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  error.textContent = "";

  const name = nameInput.value.trim();
  const birthdate = birthdateInput.value.trim();
  const gender = genderInput.value === "male" ? "Male" : "Female"; 
  const phone = phoneInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!name || !gender || !email || !password) {
    error.textContent = "Необходимо заполнить обязательные поля.";
    return;
  };

  if (birthdate) {
    const birthDate = new Date(birthdate);
    const today = new Date();
    const age = (today - birthDate) / (1000 * 60 * 60 * 24 * 365.25); 
  
    if (age < 14) {
      error.textContent = "Регистрация доступна только для пользователей старше 14 лет.";
      return;
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    error.textContent = "Введите корректный email-адрес.";
    return;
  }

  const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
  if (phone && !phoneRegex.test(phone)) {
    error.textContent = "Введите корректный номер телефона.";
    return;
  }

  if (password.length < 8) {
    error.textContent = "Пароль должен содержать минимум 8 символов.";
    return;
  }

  const birthDateFormatted = birthdate ? new Date(birthdate).toISOString() : null;

  const phoneFormatted = phone ? phone : null;

  try {
    const response = await fetch("https://blog.kreosoft.space/api/account/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: name, 
        password: password,
        email: email,
        birthDate: birthDateFormatted,
        gender: gender,
        phoneNumber: phoneFormatted, 
      }),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        document.getElementById('successMessage').classList.remove('d-none');
        
    setTimeout(() => {
      navigateTo("/login");
    }, 1000); 

   } else {
        error.textContent = "Ошибка: токен авторизации не получен.";
      }
    } else if (response.status === 400) {
      error.textContent = "Проверьте формат данных.";
    } else if (response.status === 500) {
      error.textContent = "Внутренняя ошибка сервера. Попробуйте позже.";
    } else {
      error.textContent = "Что-то пошло не так. Попробуйте снова.";
    }
  } catch (error) {
    error.textContent = "Проблема с подключением. Проверьте интернет.";
  }
});
