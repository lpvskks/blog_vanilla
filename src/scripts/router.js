document.addEventListener("click", (event) => {
  const target = event.target;
  if (!target.closest('a') || !target.getAttribute("href")) {
    return;
  }
  event.preventDefault();
  urlRoute(event);
});

const routes = {
  404: "/src/pages/notFound.html",
  "/": "/index.html",
  "/login": "/src/pages/login.html",
};

const urlRoute = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};

const handleLocation = async () => {
  let location = window.location.pathname;

  if (location.length == 0) {
    location = "/";
  }

  const route = routes[location] || routes[404];
  const html = await fetch(route).then(response => response.text());

  document.getElementById("app").innerHTML = html;
};

window.onpopstate = handleLocation;

handleLocation();
