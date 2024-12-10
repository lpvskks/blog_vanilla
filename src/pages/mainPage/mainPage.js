const api = 'https://blog.kreosoft.space/api/post';
const urlParams = new URLSearchParams(window.location.search);

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
const searchAuthorInput = document.getElementById('searchAuthor');
const readingTimeFromInput = document.getElementById('readingTimeFrom');
const readingTimeToInput = document.getElementById('readingTimeTo');
const myGroupsCheckbox = document.getElementById('myGroups');
const applyChangesBtn = document.getElementById('applyChanges'); 
const writePost = document.getElementById("write-post")
const token = localStorage.getItem('authToken');

if (token) {
   writePost.classList.remove("d-none");
}

function collectFilters() {
  const sorting = sortSelect.value;
  const author = searchAuthorInput.value.trim();
  const minReadingTime = parseInt(readingTimeFromInput.value) || 0;
  const maxReadingTime = parseInt(readingTimeToInput.value) || 0;
  const onlyMyGroups = myGroupsCheckbox.checked;
  selectedTags = Array.from(tagSelect.selectedOptions).map(option => option.value);

  return {
    page: currentPage,
    size: postsPerPage,
    sorting: sorting,
    tags: selectedTags,
    author: author,
    min: minReadingTime,
    max: maxReadingTime,
    onlyMyCommunities: onlyMyGroups,
  };
}

function updateUrl(filters) {
  const params = new URLSearchParams();
  params.set('page', filters.page);
  params.set('size', filters.size);
  if (filters.sorting) params.set('sorting', filters.sorting);
  if (filters.tags.length) params.set('tags', filters.tags.join(','));
  if (filters.author) params.set('author', filters.author);
  if (filters.min > 0) params.set('min', filters.min);
  if (filters.max > 0) params.set('max', filters.max);
  if (filters.onlyMyCommunities) params.set('onlyMyCommunities', true);

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  console.log('Updating URL:', newUrl);
  window.history.pushState({}, '', newUrl);

  loadPosts(filters);
}

async function loadPosts(filters) {
  const requestUrl = new URL(`${api}`);
  requestUrl.searchParams.set('page', filters.page);
  requestUrl.searchParams.set('size', filters.size);
  if (filters.sorting) requestUrl.searchParams.set('sorting', filters.sorting);
  if (filters.tags.length) requestUrl.searchParams.set('tags', filters.tags.join(','));
  if (filters.author) requestUrl.searchParams.set('author', filters.author);
  if (filters.min > 0) requestUrl.searchParams.set('min', filters.min);
  if (filters.max > 0) requestUrl.searchParams.set('max', filters.max);
  if (filters.onlyMyCommunities) requestUrl.searchParams.set('onlyMyCommunities', true);

  console.log('Fetching posts with URL:', requestUrl.toString());

  try {
    const response = await fetch(requestUrl.toString(), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) throw new Error('Ошибка загрузки постов');

    const data = await response.json();
    console.log('Posts loaded:', data);

    totalPages = data.pagination?.count || totalPages;

    renderPosts(data.posts);
    renderPagination(filters.page, totalPages);
  } catch (error) {
    console.error('Ошибка при загрузке постов:', error);
    postsContainer.innerHTML = '<p>Ошибка при загрузке постов. Попробуйте позже.</p>';
  }
}

function renderPosts(posts) {

  const postTemplate = document.querySelector('.post-template');
  postsContainer.querySelectorAll('.post-template:not(.d-none)').forEach(post => post.remove());

  posts.forEach(post => {
    const postElement = postTemplate.cloneNode(true);
    postElement.classList.remove('d-none');

    postElement.querySelector('.post-author').textContent = `${post.author} - ${new Date(post.createTime).toLocaleString()}`;
    postElement.querySelector('.post-title').textContent = post.title;
    postElement.querySelector('.post-description').textContent = post.description;
    postElement.querySelector('.post-tags').innerHTML = post.tags.map(tag => `<span class="text-muted">#${tag.name}</span>`).join(' ');
    postElement.querySelector('.post-reading-time').textContent = `${post.readingTime}`;
    postElement.querySelector('.post-comments-count').textContent = `${post.commentsCount}`;
    postElement.querySelector('.post-likes').textContent = `${post.likes}`;

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
        const filters = collectFilters();
        filters.page = currentPage;
        updateUrl(filters);
      }
    });

    paginationNumbers.appendChild(pageBtn);
  }
}
applyChangesBtn.addEventListener('click', () => {
  const filters = collectFilters();
  updateUrl(filters);
});

postsPerPageInput.addEventListener('change', () => {
  postsPerPage = parseInt(postsPerPageInput.value) || 5;
  const filters = collectFilters();
  updateUrl(filters);
});

loadPosts(collectFilters());  
