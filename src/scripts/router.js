const routes = {
  404: "/src/pages/notFound.html",
  "/": "/src/pages/mainPage/mainPage.html",
  "/login": "/src/pages/login/login.html",
  "/registration": "/src/pages/registration/registration.html",
  "/profile": "/src/pages/profile/profile.html",
  "/communities": "/src/pages/community/communityList/communityList.html",
  "/communities/{id}": "/src/pages/community/specificCommunity/specificCommunity.html",
  "/post/create": "/src/pages/post/createPost/createPost.html",
  "/authors": "/src/pages/author/author.html",
};

export const navigateTo = (path) => {
  window.history.pushState({}, "", path);
  handleLocation();
};

const handleLocation = async () => {
  const location = window.location.pathname;
  const matchedRoute = matchRoute(location) || routes[404];
  console.log(`Маршрут: ${matchedRoute}`);

  try {
    const response = await fetch(matchedRoute);
    if (!response.ok) {
      throw new Error(`Ошибка загрузки маршрута: ${matchedRoute}`);
    }
    const html = await response.text();
    document.getElementById("app").innerHTML = html;

    executePageScripts(document.getElementById("app"));
  } catch (error) {
    console.error("Ошибка загрузки маршрута:", error);
  }
};

const matchRoute = (location) => {
  for (const route in routes) {
    const pattern = route.replace(/{\w+}/g, "([^/]+)");
    const regex = new RegExp(`^${pattern}$`);
    const match = location.match(regex);

    if (match) {
      return routes[route].replace(/{\w+}/g, match[1]);
    }
  }
  return null;
};

const executePageScripts = (container) => {
  const scripts = container.querySelectorAll("script");
  scripts.forEach((script) => {
    const newScript = document.createElement("script");
    newScript.type = script.type;

    if (script.src) {
      newScript.src = script.src;
    } else {
      newScript.textContent = script.textContent;
    }

    document.body.appendChild(newScript);
    newScript.onload = () => console.log(`Скрипт ${script.src || "inline"} загружен.`);
  });
};

document.addEventListener("click", (event) => {
  const target = event.target.closest("a");
  if (target?.href) {
    event.preventDefault();
    navigateTo(target.getAttribute("href"));
  }
});

window.onpopstate = handleLocation;

handleLocation();
