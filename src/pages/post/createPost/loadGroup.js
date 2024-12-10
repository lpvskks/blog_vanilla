const communityUrl = 'https://blog.kreosoft.space/api/community';

async function loadCommunities() {
  try {
    const response = await fetch(communityUrl);
    if (!response.ok) {
      throw new Error('Не удалось загрузить сообщества');
    }

    const communities = await response.json();

    const groupSelect = document.getElementById('groupSelect');
    groupSelect.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = 'Выберите группу';
    groupSelect.appendChild(defaultOption);

    communities.forEach(community => {
      const option = document.createElement('option');
      option.value = community.id;
      option.textContent = community.name;
      groupSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Ошибка загрузки сообществ:', error);
  }
}

loadCommunities();