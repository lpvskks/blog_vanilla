function showErrorMessage(message) {
  const errorElement = document.getElementById("error");
  errorElement.textContent = message;
  errorElement.classList.remove("d-none");
  
  const successMessageElement = document.getElementById("successMessage");
  if (successMessageElement) {
    successMessageElement.classList.add("d-none");
  }
}

function showSuccess(message) {
  const successMessageElement = document.getElementById("successMessage");
  successMessageElement.textContent = message;
  successMessageElement.classList.remove("d-none");
  
  const errorElement = document.getElementById("error");
  if (errorElement) {
    errorElement.classList.add("d-none");
  }
}


async function saveProfileData() {
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    return;
  }

  const email = document.getElementById("email").value;
  const fullName = document.getElementById("name").value;
  const birthDate = document.getElementById("birthdate").value;
  const gender = document.getElementById("gender").value;
  const phoneNumber = document.getElementById("phone").value;

  if (!fullName || !email || !gender) {
    showErrorMessage("Необходимо заполнить обязательные поля.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showErrorMessage("Введите корректный email-адрес.");
    return;
  }

  const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
  if (phoneNumber && !phoneRegex.test(phoneNumber)) {
    showErrorMessage("Введите корректный номер телефона.");
    return;
  }

  const birthDateFormatted = birthDate ? new Date(birthDate).toISOString() : null;
  const phoneFormatted = phoneNumber ? phoneNumber : null;

  const profileData = {
    email,
    fullName,
    birthDate: birthDateFormatted,
    gender: gender === "male" ? "Male" : "Female",
    phoneNumber: phoneFormatted
  };

  try {
    const response = await fetch("https://blog.kreosoft.space/api/account/profile", {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || "Не удалось сохранить данные.");
    }

    showSuccess("Данные успешно изменены!");
  } catch (error) {
    showErrorMessage(error.message || "Произошла ошибка. Попробуйте позже.");
  }
}

async function loadProfileData() {
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    return;
  }

  try {
    const response = await fetch("https://blog.kreosoft.space/api/account/profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (data.email) document.getElementById("email").value = data.email;
    if (data.fullName) document.getElementById("name").value = data.fullName;
    if (data.phoneNumber) document.getElementById("phone").value = data.phoneNumber;
    if (data.gender) {
      document.getElementById("gender").value = data.gender.toLowerCase() === "male" ? "male" : "female";
    }
    if (data.birthDate) {
      const birthDate = new Date(data.birthDate).toISOString().split("T")[0];
      document.getElementById("birthdate").value = birthDate;
    }
  } catch (error) {
    showErrorMessage("Не удалось загрузить данные профиля. Попробуйте позже.");
  }
}

const saveButton = document.getElementById("saveButton");
if (saveButton) {
  saveButton.addEventListener("click", saveProfileData);
}
loadProfileData();
