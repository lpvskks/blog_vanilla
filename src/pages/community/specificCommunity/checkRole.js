import { navigateTo } from "/src/scripts/router.js";

const url = 'https://blog.kreosoft.space/api/community';
const token = localStorage.getItem('authToken');

console.log('Токен:', token);

async function fetchCommunityRole(communityId) {
  console.log('fetchCommunityRole вызван для communityId:', communityId);

  try {
    const response = await fetch(`${url}/${communityId}/role`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Ответ от API:', response);

    if (response.status === 401) {
      console.warn('Пользователь не авторизован (401)');
      return { role: null }; 
    }

    if (!response.ok) {
      console.error('Ошибка от API:', response.status, response.statusText);
      throw new Error('Ошибка при получении роли пользователя');
    }

    const role = await response.json();
    console.log('Полученная роль:', role);
    return { role }; 
  } catch (error) {
    console.error('Ошибка в fetchCommunityRole:', error);
    return { role: null }; 
  }
}

function renderButtons(role, communityId, buttonElement) {
  if (!token || role === null) {
    console.log('Показываем кнопку "Подписаться"');
    buttonElement.textContent = 'Подписаться';
    buttonElement.className = 'btn btn-primary';
    buttonElement.onclick = () => subscribeToCommunity(communityId, buttonElement);
  } else if (role === 'Subscriber') {
    console.log('Показываем кнопку "Отписаться"');
    buttonElement.textContent = 'Отписаться';
    buttonElement.className = 'btn btn-danger';
    buttonElement.onclick = () => unsubscribeFromCommunity(communityId, buttonElement);
  } else if (role === 'Administrator') {
    console.log('Показываем кнопку "Написать пост"');
    buttonElement.textContent = 'Написать пост';
    buttonElement.className = 'btn btn-secondary';
    buttonElement.onclick = () => navigateTo(`/communities/${communityId}/create-post`);
  }
}

async function initCommunityButtons(communityId) {
  console.log('initCommunityButtons вызван для communityId:', communityId);

  const buttonElement = document.getElementById('subscribe-btn');

  if (!buttonElement) {
    console.error('Кнопка с id="subscribe-btn" не найдена');
    return;
  }

  console.log('Кнопка найдена:', buttonElement);

  const { role } = await fetchCommunityRole(communityId);
  console.log('Полученная роль в initCommunityButtons:', role);

  renderButtons(role, communityId, buttonElement);
}

async function subscribeToCommunity(communityId, button) {
  console.log('subscribeToCommunity вызван для communityId:', communityId);

  try {
    const response = await fetch(`${url}/${communityId}/subscribe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Ответ от API (подписка):', response);

    if (response.ok) {
      console.log('Успешная подписка');
      button.textContent = 'Отписаться';
      button.className = 'btn btn-danger';
      button.onclick = () => unsubscribeFromCommunity(communityId, button);
    } else if (response.status === 401) {
      localStorage.removeItem('authToken');
      navigateTo('/login');
    } else {
      const errorData = await response.json();
      console.error('Ошибка при подписке:', errorData.message);
    }
  } catch (error) {
    console.error('Ошибка в subscribeToCommunity:', error);
  }
}

async function unsubscribeFromCommunity(communityId, button) {
  console.log('unsubscribeFromCommunity вызван для communityId:', communityId);

  try {
    const response = await fetch(`${url}/${communityId}/unsubscribe`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Ответ от API (отписка):', response);

    if (response.ok) {
      console.log('Успешная отписка');
      button.textContent = 'Подписаться';
      button.className = 'btn btn-primary';
      button.onclick = () => subscribeToCommunity(communityId, button);
    } else if (response.status === 401) {
      localStorage.removeItem('authToken');
      navigateTo('/login');
    } else {
      const errorData = await response.json();
      console.error('Ошибка при отписке:', errorData.message);
    }
  } catch (error) {
    console.error('Ошибка в unsubscribeFromCommunity:', error);
  }
}
const communityId = window.location.pathname.split('/').pop();

initCommunityButtons(communityId);
