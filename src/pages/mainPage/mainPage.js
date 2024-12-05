const writePostBtn = document.getElementById('write-post');
const token = localStorage.getItem("authToken");

if (token && writePostBtn) {
  writePostBtn.classList.remove('d-none');
};

async function fetchPosts() {
  const response = await fetch('https://blog.kreosoft.space/api/post');
  const data = await response.json();

  const posts = data.posts;
  const pagination = data.pagination;

  const postsContainer = document.getElementById('posts-container');
  postsContainer.innerHTML = ''; 

  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('border', 'rounded', 'mb-3');
    postElement.innerHTML = `
      <div class="p-3">
        <strong>${post.title} - ${new Date(post.createTime).toLocaleString()}</strong>
        <span class="text-muted">в сообществе "${post.communityName}"</span>
      </div>
      <div class="px-3">
        <h5 class="fw-bold">${post.title}</h5>
        <hr class="mt-1 mb-2">
      </div>
      <div class="px-3">
        <p class="mb-2">${post.description}</p>
      </div>
      <div class="px-3 mb-2">
        ${post.tags.map(tag => `<span class="text-muted">#${tag.name}</span>`).join(' ')}
      </div>
      <div class="px-3 mb-2">
        <span>Время прочтения: ${post.readingTime} минут</span>
      </div>
      <div class="bg-light border-top px-3 py-2 d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <span class="me-2 fs-6">${post.commentsCount}</span>
          <i class="bi bi-chat-left-text fs-6" style="cursor: pointer;"></i>
        </div>
        <div class="d-flex align-items-center">
          <span id="likeCount" class="me-2 fs-6">${post.likes}</span>
          <i class="bi bi-heart text-muted fs-6" id="likeIcon" style="cursor: pointer;"></i>
        </div>
      </div>
    `;
    postsContainer.appendChild(postElement);
  });

  const paginationContainer = document.getElementById('pagination-container');
  paginationContainer.innerHTML = ''; 

  for (let i = 1; i <= pagination.count; i++) {
    const pageItem = document.createElement('li');
    pageItem.classList.add('page-item');
    pageItem.innerHTML = `
      <a class="page-link text-primary border-primary" href="#" data-page="${i}">${i}</a>
    `;
    paginationContainer.appendChild(pageItem);
  }
}
fetchPosts();