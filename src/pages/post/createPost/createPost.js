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
  const postData = {
    title,
    description,
    readingTime,
    tags,
  };

  if (addressId && addressId !== 'Не выбран') {
    postData.addressId = addressId;
  };

  if (groupId && groupId !== 'Выберите группу') {
    postData.groupId = groupId;
  };

  if (image) {
    postData.image = image;
  };

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
      alert('Пост успешно создан!');
    } else {
      const error = await response.json();
      console.error('Ошибка при создании поста:', error);

      if (error.errors) {
        for (const [field, messages] of Object.entries(error.errors)) {
          console.error(`Ошибка в поле ${field}: ${messages.join(', ')}`);
        }
      }

      alert('Ошибка при создании поста: ' + (error.title || 'Неизвестная ошибка'));
    }
  } catch (err) {
    console.error('Ошибка при выполнении запроса:', err);
    alert('Ошибка при создании поста');
  }
});
