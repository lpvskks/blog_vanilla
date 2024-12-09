const api = 'https://blog.kreosoft.space/api/community';
const urlParams = new URLSearchParams(window.location.search);
const communityId = window.location.pathname.split('/').pop();

let currentPage = parseInt(urlParams.get('page')) || 1;
let postsPerPage = parseInt(urlParams.get('size')) || 5;
let totalPages = 5;
let selectedTags = [];

const prevPageBtn = document.getElementById('prev-page-btn');
const nextPageBtn = document.getElementById('next-page-btn');
const paginationNumbers = document.getElementById('pagination-numbers');
const postsPerPageInput = document.getElementById('posts-per-page');
const postsContainer = document.getElementById('posts-container');
const sortSelect = document.getElementById('sort');
const tagSelect = document.getElementById('tagSelect');

const token = localStorage.getItem('authToken');

let debounceTimeout = null;
function debounceRequest(callback, delay) {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(callback, delay);
}

function updateUrl(page, pageSize, sorting, tags) {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('size', pageSize);
  if (sorting) params.set('sorting', sorting);
  if (tags.length) params.set('tags', tags.join(','));
  
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, '', newUrl);
  loadPosts(page, pageSize, sorting, tags);
}

async function loadCommunityDetails() {
  try {
    const response = await fetch(`${api}/${communityId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) throw new Error('Ошибка загрузки информации о сообществе');

    const community = await response.json();
    document.getElementById('community-name').textContent = community.name;
    document.getElementById('subscriber-count').textContent = community.subscribersCount;
    loadPosts(currentPage, postsPerPage);
  } catch (error) {
    console.error('Ошибка при загрузке информации о сообществе:', error);
  }
}

async function loadPosts(page, size, sorting = '', tags = []) {
  const requestUrl = new URL(`${api}/${communityId}/post`);
  requestUrl.searchParams.set('page', page);
  requestUrl.searchParams.set('size', size);
  if (sorting) requestUrl.searchParams.set('sorting', sorting);
  if (tags.length) requestUrl.searchParams.set('tags', tags.join(','));

  try {
    const response = await fetch(requestUrl.toString(), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (response.status === 403) {
      postsContainer.innerHTML = '<p>У вас нет доступа к постам. Подпишитесь, чтобы увидеть содержимое.</p>';
      return;
    }

    if (!response.ok) throw new Error('Ошибка загрузки постов');

    const data = await response.json();
    totalPages = data.pagination?.count || totalPages;

    renderPosts(data.posts);
    renderPagination(page, totalPages);
  } catch (error) {
    console.error('Ошибка при загрузке постов:', error);
    postsContainer.innerHTML = '<p>Ошибка при загрузке постов. Попробуйте позже.</p>';
  }
}

function renderPosts(posts) {
  const postTemplate = document.querySelector('.post-template');
  
  if (!postTemplate) {
    console.error("Шаблон поста не найден");
    return;
  }

  postsContainer.querySelectorAll('.post-template:not(.d-none)').forEach(post => post.remove());

  posts.forEach(post => {
    const postElement = postTemplate.cloneNode(true);
    postElement.classList.remove('d-none');

    postElement.querySelector('.post-author').textContent = `${post.author} - ${new Date(post.createTime).toLocaleString()}`;
    postElement.querySelector('.post-title').textContent = post.title;
    postElement.querySelector('.post-description').textContent = post.description;
    postElement.querySelector('.post-tags').innerHTML = post.tags.map(tag => `<span class="text-muted">#${tag.name}</span>`).join(' ');
    postElement.querySelector('.post-reading-time').textContent = post.readingTime;
    postElement.querySelector('.post-comments-count').textContent = post.commentsCount;
    postElement.querySelector('.post-likes').textContent = post.likes;

    postsContainer.appendChild(postElement);
  });
}

function renderPagination(page, total) {
  paginationNumbers.innerHTML = '';

  const startPage = Math.max(1, page - 1);
  const endPage = Math.min(total, startPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `btn mx-1 ${i === page ? 'btn-primary' : 'btn-outline-primary'}`;
    pageBtn.textContent = i;

    pageBtn.addEventListener('click', () => {
      if (currentPage !== i) {
        currentPage = i;
        updateUrl(currentPage, postsPerPage, sortSelect.value, selectedTags);
      }
    });

    paginationNumbers.appendChild(pageBtn);
  }
}

prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    updateUrl(currentPage, postsPerPage, sortSelect.value, selectedTags);
  }
});

nextPageBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    updateUrl(currentPage, postsPerPage, sortSelect.value, selectedTags);
  }
});

postsPerPageInput.addEventListener('change', () => {
  const newPostsPerPage = parseInt(postsPerPageInput.value);
  if (newPostsPerPage > 0) {
    postsPerPage = newPostsPerPage;
    debounceRequest(() => updateUrl(currentPage, postsPerPage, sortSelect.value, selectedTags), 300);
  }
});

sortSelect.addEventListener('change', () => {
  debounceRequest(() => updateUrl(currentPage, postsPerPage, sortSelect.value, selectedTags), 300);
});

tagSelect.addEventListener('change', () => {
  selectedTags = Array.from(tagSelect.selectedOptions).map(option => option.value);
  debounceRequest(() => updateUrl(currentPage, postsPerPage, sortSelect.value, selectedTags), 300);
});

loadCommunityDetails();
