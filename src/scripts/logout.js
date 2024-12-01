import { navigateTo } from "./router.js"; 
import { updateHeader } from "/main.js"; 

export async function handleLogout() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return;
  }

  try {
    const response = await fetch("https://blog.kreosoft.space/api/account/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      updateHeader(); 
      navigateTo("/");
    } else {
      console.error("Ошибка выхода:", response.status);
    }
  } catch (error) {
    console.error("Ошибка при выполнении запроса на выход:", error);
  }
};
