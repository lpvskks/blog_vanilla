import { handleLike } from "../../mainPage/likeHandler";
const api = 'https://blog.kreosoft.space/api/post';
const id = window.location.pathname.split('/').pop();
const postsContainer = document.getElementById('posts-container');


const token = localStorage.getItem('authToken');

async function loadPosts() {
 try {
    const response = await fetch(`${api}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (response.status === 403) {
      postsContainer.innerHTML = '<p>У вас нет доступа к постам. Подпишитесь, чтобы увидеть содержимое.</p>';
      return;
    }

    if (!response.ok) throw new Error('Ошибка загрузки постов');

    const data = await response.json();

    renderPosts(data);
  } catch (error) {
    console.error('Ошибка при загрузке постов:', error);
    postsContainer.innerHTML = '<p>Ошибка при загрузке постов. Попробуйте позже.</p>';
  }
}

function renderPosts(post) {
  const postTemplate = document.querySelector('.post-template');
  if (!postTemplate) {
    console.error("Шаблон поста не найден");
    return;
  }

    const postElement = postTemplate.cloneNode(true);
    postElement.classList.remove('d-none');

    postElement.setAttribute('data-post-id', post.id);

    postElement.querySelector('.post-author').textContent = `${post.author} - ${new Date(post.createTime).toLocaleString()}`;
    postElement.querySelector('.post-title').textContent = post.title;
    postElement.querySelector('.post-description').textContent = post.description;
    postElement.querySelector('.post-tags').innerHTML = post.tags.map(tag => `<span class="text-muted">#${tag.name}</span>`).join(' ');
    postElement.querySelector('.post-reading-time').textContent = post.readingTime;
    postElement.querySelector('.post-comments-count').textContent = post.commentsCount;
    postElement.querySelector('.post-likes').textContent = post.likes;

    if (post.image) {
      const imageContainer = postElement.querySelector('.post-image-container');
      const imageElement = postElement.querySelector('.post-image');
      imageElement.src = post.image; 
      imageContainer.classList.remove('d-none'); 
    }

    const likeIcon = postElement.querySelector('#likeIcon');
    if (post.hasLike) {
      likeIcon.classList.remove('bi-heart', 'text-muted');
      likeIcon.classList.add('bi-heart-fill', 'text-danger');
    } else {
      likeIcon.classList.remove('bi-heart-fill', 'text-danger');
      likeIcon.classList.add('bi-heart', 'text-muted');
    }

    postsContainer.appendChild(postElement);
};


postsContainer.addEventListener('click', (event) => {
  const target = event.target;

  if (target.classList.contains('bi-heart') || target.classList.contains('bi-heart-fill')) {
    const postElement = target.closest('.post-template');
    const postId = postElement.getAttribute('data-post-id');
    const likeCountElement = postElement.querySelector('.post-likes');

    handleLike(postId, target, likeCountElement);
  }
});

loadPosts();
