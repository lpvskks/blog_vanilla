const routes = {
  404: "/src/pages/notFound.html",
  "/": "/src/pages/mainPage/mainPage.html",
  "/login": "/src/pages/login/login.html",
  "/registration": "/src/pages/registration/registration.html",
  "/profile": "/src/pages/profile/profile.html",
};

export const navigateTo = (path) => {
    window.history.pushState({}, "", path); 
    handleLocation(); 
};

const handleLocation = async () => {
  let location = window.location.pathname;

  if (location.length === 0) {
    location = "/";
  }

  const route = routes[location] || routes[404]; 

  console.log(`Запрашиваемый маршрут: ${route}`);

  try {
    const response = await fetch(route);

    if (!response.ok) {
      throw new Error(`Ошибка загрузки страницы: ${route}`);
    }

    const html = await response.text();
    document.getElementById("app").innerHTML = html;

    executePageScripts(document.getElementById("app"));
  } catch (error) {
    console.error("Ошибка при загрузке маршрута:", error);
  }
};

const executePageScripts = (container) => {
  const scripts = container.querySelectorAll("script");
  scripts.forEach((script) => {
    if (script.src && document.querySelector(`script[src="${script.src}"]`)) {
      console.log(`Скрипт ${script.src} уже загружен, пропускаем.`);
      return;
    }

    const newScript = document.createElement("script");
    newScript.type = script.type;

    if (script.src) {
      newScript.src = script.src;
      newScript.onload = () => console.log(`Скрипт ${script.src} загружен успешно.`);
      newScript.onerror = (error) => console.error(`Ошибка при загрузке скрипта: ${script.src}`, error);
    } else {
      newScript.textContent = script.textContent;
    }

    document.body.appendChild(newScript);
  });
};

document.addEventListener("click", (event) => {
  const target = event.target.closest("a");
  if (target && target.href) {
    event.preventDefault();
    const path = target.getAttribute("href");
    navigateTo(path);
  }
});

window.onpopstate = handleLocation;

handleLocation();
