import { navigateTo } from "/src/scripts/router.js";

export async function handleLike(postId, likeIcon, likeCountElement) {
  const apiUrl = `https://blog.kreosoft.space/api/post/${postId}/like`;
  const token = localStorage.getItem('authToken');
  const isLiked = likeIcon.classList.contains('bi-heart-fill'); 

  try {
    const response = await fetch(apiUrl, {
      method: isLiked ? 'DELETE' : 'POST', 
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (response.ok) {
      if (isLiked) {
        likeIcon.classList.remove('bi-heart-fill', 'text-danger');
        likeIcon.classList.add('bi-heart', 'text-muted');
        likeCountElement.textContent = parseInt(likeCountElement.textContent) - 1; 
      } else {
        likeIcon.classList.remove('bi-heart', 'text-muted');
        likeIcon.classList.add('bi-heart-fill', 'text-danger');
        likeCountElement.textContent = parseInt(likeCountElement.textContent) + 1;
      }
    } else if (response.status === 401) {
      localStorage.removeItem('authToken');
      navigateTo('/login');
    } else {
      console.error('Ошибка при выполнении действия:', response.statusText);
    }
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
  }
}
