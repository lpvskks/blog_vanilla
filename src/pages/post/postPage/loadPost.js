import { handleLike } from "../../mainPage/likeHandler";
const api = 'https://blog.kreosoft.space/api/post';
const id = window.location.pathname.split('/').pop();
const postsContainer = document.getElementById('posts-container');
const commentsContainer = document.getElementById('comments-container');
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

    if (!response.ok) throw new Error('Ошибка загрузки поста');

    const data = await response.json();

    renderPost(data);
    renderComments(data.comments);
  } catch (error) {
    console.error('Ошибка при загрузке поста:', error);
    postsContainer.innerHTML = '<p>Ошибка при загрузке поста. Попробуйте позже.</p>';
  }
}

function renderPost(post) {
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
}

function renderComments(comments) {
  const commentTemplate = document.getElementById('comment-template');
  const subCommentTemplate = document.getElementById('subcomment-template');

  if (!commentTemplate || !subCommentTemplate) {
    console.error('Шаблон для комментариев или подкомментариев не найден');
    return;
  }

  if (comments.length === 0) {
    commentsContainer.innerHTML += '<p>Нет комментариев.</p>';
    return;
  }

  comments.forEach(comment => {
    const commentElement = commentTemplate.cloneNode(true);
    commentElement.classList.remove('d-none');

   
    if (comment.deleteDate) {
      commentElement.querySelector('.comment-author').textContent = '[Комментарий удален]';
      commentElement.querySelector('.comment-time').textContent = new Date(comment.deleteDate).toLocaleString();
      commentElement.querySelector('.comment-content').textContent = '';
      commentElement.querySelector('.btn').classList.add('d-none'); 
    } else {
      commentElement.querySelector('.comment-author').textContent = comment.author;
      commentElement.querySelector('.comment-time').textContent = new Date(comment.createTime).toLocaleString();
      commentElement.querySelector('.comment-content').textContent = comment.content;
    }

    if (comment.subComments > 0 || comment.deleteDate) {
      const revealButton = commentElement.querySelector('.btn-reveal-subcomments');
      revealButton.classList.remove('d-none'); 
      revealButton.addEventListener('click', () => loadSubComments(comment.id, commentElement, subCommentTemplate));
    }

    commentsContainer.appendChild(commentElement);
  });
}

async function loadSubComments(commentId, parentCommentElement, subCommentTemplate) {
  try {
    const response = await fetch(`https://blog.kreosoft.space/api/comment/${commentId}/tree`);
    if (!response.ok) throw new Error('Ошибка загрузки подкомментариев');

    const subComments = await response.json();
    const subCommentsContainer = parentCommentElement.querySelector('.subcomments-container');

    subCommentsContainer.innerHTML = ''; 

    subComments.forEach(subComment => {
      const subCommentElement = subCommentTemplate.cloneNode(true);
      subCommentElement.classList.remove('d-none');

      if (subComment.deleteDate) {
        subCommentElement.querySelector('.subcomment-author').textContent = '[Комментарий удален]';
        subCommentElement.querySelector('.subcomment-content').textContent = '';
        subCommentElement.querySelector('.subcomment-time').textContent = new Date(subComment.deleteDate).toLocaleString();
      } else {
        subCommentElement.querySelector('.subcomment-author').textContent = subComment.author;
        subCommentElement.querySelector('.subcomment-time').textContent = new Date(subComment.createTime).toLocaleString();
        subCommentElement.querySelector('.subcomment-content').textContent = subComment.content;
      }

      subCommentsContainer.appendChild(subCommentElement);
    });

    const revealButton = parentCommentElement.querySelector('.btn-reveal-subcomments');
    if (revealButton) {
      revealButton.classList.add('d-none');
    }
  } catch (error) {
    console.error('Ошибка при загрузке подкомментариев:', error);
  }
}

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
