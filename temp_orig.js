let appData = null;
let activeTags = [];
let searchQuery = '';

const storage = (() => {
  let memoryStore = {};
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, 'ok');
    window.localStorage.removeItem(testKey);
    return {
      get(key) {
        const value = window.localStorage.getItem(key);
        if (!value) return null;
        try {
          return JSON.parse(value);
        } catch (error) {
          return value;
        }
      },
      set(key, val) {
        window.localStorage.setItem(key, JSON.stringify(val));
      },
      remove(key) {
        window.localStorage.removeItem(key);
      }
    };
  } catch (error) {
    return {
      get(key) {
        return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null;
      },
      set(key, val) {
        memoryStore[key] = val;
      },
      remove(key) {
        delete memoryStore[key];
      }
    };
  }
})();

function checkPassword() {
  const input = document.getElementById('passwordInput');
  const error = document.getElementById('passwordError');
  if (!input) return;
  if (input.value.trim() === 'guestpw4mechanism') {
    storage.set('mechanism_lib_logged_in', 'true');
    document.getElementById('passwordOverlay').classList.add('hidden');
    initApp();
  } else {
    error.textContent = '密码错误，请重试';
  }
}

function initApp() {
  const nickname = storage.get('roundtable_nickname');
  if (!nickname) {
    document.getElementById('nicknameOverlay').classList.remove('hidden');
  } else {
    loadAppData();
  }
}

function submitNickname() {
  const input = document.getElementById('nicknameInput');
  const error = document.getElementById('nicknameError');
  const nickname = input.value.trim();
  if (!nickname) {
    error.textContent = '花名不能为空';
    return;
  }
  storage.set('roundtable_nickname', nickname);
  document.getElementById('nicknameOverlay').classList.add('hidden');
  if (appData) {
    handleRoute();
  } else {
    loadAppData();
  }
}

function handleEnterKey(inputId, handler) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      handler();
    }
  });
}

handleEnterKey('passwordInput', checkPassword);
handleEnterKey('nicknameInput', submitNickname);

if (storage.get('mechanism_lib_logged_in')) {
  const overlay = document.getElementById('passwordOverlay');
  if (overlay) {
    overlay.classList.add('hidden');
  }
  initApp();
}

async function loadAppData() {
  const app = document.getElementById('app');
  if (!app) return;
  try {
    const response = await fetch(`roundtable-data.json?v=${Date.now()}`);
    if (!response.ok) {
      throw new Error('数据加载失败');
    }
    appData = await response.json();
    handleRoute();
  } catch (error) {
    app.innerHTML = `<div class="empty-state">⚠️ 数据加载失败，请稍后再试</div>`;
  }
}

function handleRoute() {
  if (!appData) return;
  const hash = window.location.hash.replace('#', '');
  if (hash.startsWith('topic=')) {
    renderTopicDetail(hash.replace('topic=', ''));
  } else if (hash.startsWith('case=')) {
    const caseId = hash.replace('case=', '');
    const caseItem = appData.cases.find((item) => item.id === caseId);
    if (caseItem) {
      renderTopicDetail(caseItem.topicId);
      setTimeout(() => showCase(caseId), 50);
    } else {
      renderTopicList();
    }
  } else if (hash === 'profile') {
    renderProfile();
  } else {
    renderTopicList();
  }
}

window.addEventListener('hashchange', handleRoute);

function formatText(text) {
  if (!text) return '暂无内容';
  const hasSemicolon = text.includes('；');
  const normalized = text.replace(/；/g, '\n');
  if (normalized.includes('\n')) {
    return normalized
      .split('\n')
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('- ')) {
          return `• ${trimmed.replace('- ', '')}`;
        }
        if (trimmed.startsWith('•')) {
          return trimmed;
        }
        if (hasSemicolon) {
          return `• ${trimmed}`;
        }
        return trimmed;
      })
      .filter(Boolean)
      .join('<br>');
  }
  return normalized;
}

function getLikes() {
  return storage.get('roundtable_likes') || [];
}

function getBookmarks() {
  return storage.get('roundtable_bookmarks') || [];
}

function toggleLike(caseId, event) {
  event.stopPropagation();
  const likes = getLikes();
  const index = likes.indexOf(caseId);
  if (index > -1) {
    likes.splice(index, 1);
  } else {
    likes.push(caseId);
  }
  storage.set('roundtable_likes', likes);
  updateInteractionButtons(caseId);
}

function toggleBookmark(caseId, event) {
  event.stopPropagation();
  const bookmarks = getBookmarks();
  const index = bookmarks.indexOf(caseId);
  if (index > -1) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push(caseId);
  }
  storage.set('roundtable_bookmarks', bookmarks);
  updateInteractionButtons(caseId);
}

function updateInteractionButtons(caseId) {
  const likes = getLikes();
  const bookmarks = getBookmarks();
  const likeButtons = document.querySelectorAll(`[data-like="${caseId}"]`);
  const bookmarkButtons = document.querySelectorAll(`[data-bookmark="${caseId}"]`);
  likeButtons.forEach((button) => {
    if (likes.includes(caseId)) {
      button.classList.add('active');
      button.innerHTML = '👍 已赞';
    } else {
      button.classList.remove('active');
      button.innerHTML = '👍 点赞';
    }
  });
  bookmarkButtons.forEach((button) => {
    if (bookmarks.includes(caseId)) {
      button.classList.add('active');
      button.innerHTML = '⭐ 已收藏';
    } else {
      button.classList.remove('active');
      button.innerHTML = '⭐ 收藏';
    }
  });
}

function getInteractionBarHtml(caseId) {
  return `
    <div class="interaction-bar">
      <button class="interaction-btn" data-like="${caseId}" onclick="toggleLike('${caseId}', event)">👍 点赞</button>
      <button class="interaction-btn" data-bookmark="${caseId}" onclick="toggleBookmark('${caseId}', event)">⭐ 收藏</button>
    </div>
  `;
}

function renderTopicList() {
  const app = document.getElementById('app');
  const topics = [...appData.topics].sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  const caseTags = new Set();
  appData.cases.forEach((caseItem) => {
    caseItem.tags.forEach((tag) => caseTags.add(tag));
  });

  const tagsHtml = [...caseTags]
    .map((tag) => {
      const active = activeTags.includes(tag) ? 'active' : '';
      return `<span class="tag-pill ${active}" onclick="toggleTag('${tag}')">${tag}</span>`;
    })
    .join('');

  const filteredTopics = topics.filter((topic) => topicMatchesFilters(topic));
  const topicCards = filteredTopics
    .map((topic) => {
      const caseCount = appData.cases.filter((item) => item.topicId === topic.id).length;
      return `
        <div class="topic-card" onclick="location.hash='topic=${topic.id}'">
          <div class="topic-title">${topic.title}</div>
          <div class="topic-desc">${topic.description}</div>
          <div class="topic-meta">
            <span>📅 ${topic.publishDate}</span>
            <span>📁 ${caseCount} 个案例</span>
          </div>
          <div class="topic-tags">
            ${topic.tags.map((tag) => `<span class="topic-tag">${tag}</span>`).join('')}
          </div>
        </div>
      `;
    })
    .join('');

  app.innerHTML = `
    <section class="hero">
      <h1>🔥 回响圆桌</h1>
      <p>复盘即是对过去决策的回响，通过分享让经验产生二次共鸣。</p>
      <div class="stats-bar">
        <div class="stat-card"><span>${appData.topics.length}</span><div>主题期数</div></div>
        <div class="stat-card"><span>${appData.cases.length}</span><div>案例沉淀</div></div>
        <div class="stat-card"><span>${getUniqueAuthors().length}</span><div>共创作者</div></div>
      </div>
    </section>

    <div class="search-bar">
      <input class="search-input" id="searchInput" placeholder="搜索主题、案例、作者、标签..." value="${searchQuery}">
      <button class="search-clear ${searchQuery ? '' : 'hidden'}" id="clearSearch" onclick="clearSearch()">清除</button>
 
