async function fetchTags() {
  try {
    const response = await fetch("https://blog.kreosoft.space/api/tag");
    
    if (!response.ok) {
      throw new Error(`Ошибка при получении тегов: ${response.status}`);
    }

    const tags = await response.json();
    populateTagSelect(tags);
  } catch (error) {
    console.error("Не удалось загрузить теги:", error);
  }
}

function populateTagSelect(tags) {
  const tagSelect = document.getElementById("tagSelect");
  tagSelect.innerHTML = "";

  tags.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag.id; 
    option.textContent = tag.name; 
    tagSelect.appendChild(option);
  });
}

fetchTags();
