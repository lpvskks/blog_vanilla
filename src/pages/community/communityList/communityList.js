const url = 'https://blog.kreosoft.space/api/community';
const token = localStorage.getItem('authToken');

async function fetchCommunityData() {
  try {
    const allCommunitiesResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!allCommunitiesResponse.ok) {
      throw new Error('Ошибка при получении списка сообществ');
    }

    const allCommunities = await allCommunitiesResponse.json();

    const userCommunitiesResponse = await fetch(`${url}/my`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!userCommunitiesResponse.ok) {
      throw new Error('Ошибка при получении данных о сообществах пользователя');
    }

    const userCommunities = await userCommunitiesResponse.json();

    const userRoles = {};
    userCommunities.forEach(({ communityId, role }) => {
      userRoles[communityId] = role;
    });

    renderCommunities(allCommunities, userRoles);
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

function renderCommunities(communities, userRoles) {
  communities.forEach((community, index) => {
    const nameElement = document.getElementById(`community-${index + 1}-name`);
    const buttonElement = document.getElementById(`community-${index + 1}-btn`);

    if (!nameElement || !buttonElement) return; 

    nameElement.textContent = community.name;

    const role = userRoles[community.id];
    if (role === 'Administrator') {
      buttonElement.style.display = 'none';
    } else if (role === 'Subscriber') {
      buttonElement.textContent = 'Отписаться';
      buttonElement.className = 'btn btn-danger';
      buttonElement.onclick = () => unsubscribeFromCommunity(community.id, buttonElement);
    } else {
      buttonElement.textContent = 'Подписаться';
      buttonElement.className = 'btn btn-primary';
      buttonElement.onclick = () => subscribeToCommunity(community.id, buttonElement);
    }
  });
}

async function subscribeToCommunity(communityId, button) {
  try {
    const response = await fetch(`${url}/${communityId}/subscribe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      button.textContent = 'Отписаться';
      button.className = 'btn btn-danger';
      button.onclick = () => unsubscribeFromCommunity(communityId, button);
    } else {
      const errorData = await response.json();
      console.error('Ошибка при подписке:', errorData.message);
    }
  } catch (error) {
    console.error('Ошибка при подписке:', error);
  }
}

async function unsubscribeFromCommunity(communityId, button) {
  try {
    const response = await fetch(`${url}/${communityId}/unsubscribe`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      button.textContent = 'Подписаться';
      button.className = 'btn btn-primary';
      button.onclick = () => subscribeToCommunity(communityId, button);
    } else {
      const errorData = await response.json();
      console.error('Ошибка при отписке:', errorData.message);
    }
  } catch (error) {
    console.error('Ошибка при отписке:', error);
  }
}

function showErrorMessage(message) {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = message;
  errorMessage.classList.remove('d-none');
  setTimeout(() => errorMessage.classList.add('d-none'), 2000); 
}

fetchCommunityData();
