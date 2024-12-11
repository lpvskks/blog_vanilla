const communityUrl = 'https://blog.kreosoft.space/api/community/my';
const authToken = localStorage.getItem('authToken');

async function loadCommunities() {
  try {
    const response = await fetch(communityUrl, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Не удалось загрузить сообщества');
    }

    const communities = await response.json();
    const storedCommunities = JSON.parse(localStorage.getItem('communities')) || [];
    const groupSelect = document.getElementById('groupSelect');
    const groupRow = document.getElementById('groupRow');

    const adminCommunities = communities.filter(community => community.role === 'Administrator');

    if (adminCommunities.length > 0) {
      groupRow.classList.remove('d-none');

      groupSelect.innerHTML = '';
      const defaultOption = document.createElement('option');
      defaultOption.disabled = true;
      defaultOption.selected = true;
      defaultOption.textContent = 'Выберите группу';
      groupSelect.appendChild(defaultOption);

      adminCommunities.forEach(community => {
        const communityData = storedCommunities.find(item => item.id === community.communityId);
        const communityName = communityData ? communityData.name : `ID: ${community.communityId} (название не найдено)`;

        const option = document.createElement('option');
        option.value = community.communityId;
        option.textContent = communityName; 
        groupSelect.appendChild(option);
      });
    } else {
      groupRow.classList.add('d-none');
    }
  } catch (error) {
    console.error('Ошибка загрузки сообщества:', error);
  }
}

// Вызов функции загрузки
loadCommunities();
