async function loadAuthors() {
  try {
    const response = await fetch('https://blog.kreosoft.space/api/author/list');
    if (!response.ok) {
      throw new Error('Не удалось загрузить данные');
    }

    const authors = await response.json();
    authors.sort((a, b) => a.fullName.localeCompare(b.fullName));

    const authorListContainer = document.getElementById('author-list');
    const authorTemplate = document.querySelector('.author-template');
    authorListContainer.innerHTML = '';

    const sortedByPopularity = [...authors].sort((a, b) => {
      if (b.posts !== a.posts) {
        return b.posts - a.posts;
      }
      return b.likes - a.likes;
    });

    const topAuthors = sortedByPopularity.slice(0, 3);

    authors.forEach(author => {
      const createdDate = new Date(author.created).toLocaleDateString('ru-RU');
      const birthDate = new Date(author.birthDate).toLocaleDateString('ru-RU');

      const authorElement = authorTemplate.cloneNode(true);
      authorElement.querySelector('.author-name').textContent = author.fullName;
      authorElement.querySelector('.created-date').textContent = `Создан: ${createdDate}`;
      authorElement.querySelector('.author-posts').textContent = author.posts;
      authorElement.querySelector('.author-likes').textContent = author.likes;
      authorElement.querySelector('.author-birthdate').textContent = birthDate;

      const avatarElement = authorElement.querySelector('.author-avatar');
      if (author.gender === 'Female') {
        avatarElement.src = 'src/images/girl.jpg';
      } else {
        avatarElement.src = 'src/images/man.jpg';
      }

      const crownImage = document.createElement('img');
      crownImage.style.position = 'absolute';
      crownImage.style.width = '35px';
      crownImage.style.height = '35px';
      crownImage.style.transform = 'rotate(20deg)';
      crownImage.style.top = '-20px';
      crownImage.style.left = '35px'; 

      if (topAuthors[0] && author.fullName === topAuthors[0].fullName) {
        crownImage.src = '/src/images/goldCrown.svg';
      } else if (topAuthors[1] && author.fullName === topAuthors[1].fullName) {
        crownImage.src = 'src/images/silverCrown.svg';
      } else if (topAuthors[2] && author.fullName === topAuthors[2].fullName) {
        crownImage.src = 'src/images/bronzeCrown.svg';
      }

      if (crownImage.src) {
        const avatarContainer = document.createElement('div');
        avatarContainer.style.position = 'relative';
        avatarElement.parentNode.replaceChild(avatarContainer, avatarElement);
        avatarContainer.appendChild(avatarElement);
        avatarContainer.appendChild(crownImage);
      }

      authorElement.style.display = 'block';
      authorListContainer.appendChild(authorElement);
    });
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  }
}

loadAuthors();
