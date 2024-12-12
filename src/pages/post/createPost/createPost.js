import { navigateTo } from "/src/scripts/router.js";

document.getElementById('createPostButton').addEventListener('click', async () => {
  const title = document.getElementById('postTitle').value.trim();
  const readingTime = parseInt(document.getElementById('readingTime').value, 10);
  const image = document.getElementById('imageLink').value.trim();
  const description = document.getElementById('postText').value.trim();

  const addressId = document.getElementById('regionSelect').value;
  const groupId = document.getElementById('groupSelect').value;
  const tagsSelect = document.getElementById('tagSelect');
  const tags = Array.from(tagsSelect.selectedOptions).map(option => option.value);

  const userToken = localStorage.getItem('authToken');

  let isValid = true;

  if (title.length < 5 || title.length > 1000) {
    document.getElementById('titleError').style.display = 'block';
    isValid = false;
  } else if (title === "") {
    document.getElementById('titleError').textContent = "Название не может быть пустым";
    document.getElementById('titleError').style.display = 'block';
    isValid = false;
  } else {
    document.getElementById('titleError').style.display = 'none';
  }

  if (description.length < 5 || description.length > 5000) {
    document.getElementById('postTextError').style.display = 'block';
    isValid = false;
  } else if (description === "") {
    document.getElementById('postTextError').textContent = "Описание не может быть пустым";
    document.getElementById('postTextError').style.display = 'block';
    isValid = false;
  } else {
    document.getElementById('postTextError').style.display = 'none';
  }

  if (isNaN(readingTime) || readingTime < 0) {
    document.getElementById('readingTimeError').style.display = 'block';
    document.getElementById('readingTimeError').textContent = "Время чтения не может быть отрицательным";
    isValid = false;
  } else {
    document.getElementById('readingTimeError').style.display = 'none';
  }

  const urlRegex = /^(https?|ftp|file|data):\/\/[^\s/$.?#].[^\s]*$/i;
  if (image && !urlRegex.test(image)) {
    document.getElementById('imageLinkError').style.display = 'block';
    isValid = false;
  } else {
    document.getElementById('imageLinkError').style.display = 'none';
  }

  if (!isValid) {
    console.log("Форма не прошла валидацию");
    return; 
  }

  const postData = {
    title,
    description,
    readingTime,
    tags,
  };

  if (addressId && addressId !== 'Не выбран') {
    postData.addressId = addressId;
  }

  if (groupId && groupId !== 'Выберите группу') {
    postData.groupId = groupId;
  }

  if (image) {
    postData.image = image;
  }

  console.log('Сформированные данные для отправки:', JSON.stringify(postData, null, 2));

  try {
    const response = await fetch('https://blog.kreosoft.space/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      navigateTo('/'); 
    } else {
      const error = await response.json();
      console.error('Ошибка при создании поста:', error);
    }
  } catch (err) {
    console.error('Ошибка при выполнении запроса:', err);
    alert('Ошибка при создании поста');
  }
});
