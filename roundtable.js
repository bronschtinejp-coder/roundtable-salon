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
      <div class="hero-content">
        <div class="hero-badge">策划复盘平台</div>
        <h1>回响圆桌</h1>
        <p class="hero-desc">复盘即是对过去决策的回响，通过分享让经验产生二次共鸣。</p>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <div class="hero-stat-number">${appData.topics.length}</div>
          <div class="hero-stat-label">主题期数</div>
        </div>
        <div class="hero-stat-divider"></div>
        <div class="hero-stat">
          <div class="hero-stat-number">${appData.cases.length}</div>
          <div class="hero-stat-label">案例沉淀</div>
        </div>
        <div class="hero-stat-divider"></div>
        <div class="hero-stat">
          <div class="hero-stat-number">${getUniqueAuthors().length}</div>
          <div class="hero-stat-label">共创作者</div>
        </div>
      </div>
    </section>
    <div class="section-label">专题列表</div>
    <div class="search-bar">
      <input class="search-input" id="searchInput" placeholder="搜索主题、案例、作者、标签..." value="${searchQuery}">
      <button class="search-clear ${searchQuery ? '' : 'hidden'}" id="clearSearch" onclick="clearSearch()">清除</button>
    </div>
    <div class="filter-tags">
      ${tagsHtml}
      ${activeTags.length ? '<button class="clear-filters" onclick="clearFilters()">清除筛选</button>' : ''}
    </div>
    <div class="topics-grid">
      ${topicCards || '<div class="empty-state">🔍 没有找到相关内容，试试其他关键词？</div>'}
    </div>
  `;

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => onSearchInput(event.target.value));
  }
}

function onSearchInput(value) {
  searchQuery = value;
  const clearButton = document.getElementById('clearSearch');
  if (clearButton) {
    clearButton.classList.toggle('hidden', !value);
  }
  if (onSearchInput.timer) {
    clearTimeout(onSearchInput.timer);
  }
  onSearchInput.timer = setTimeout(() => {
    renderTopicList();
  }, 300);
}

function clearSearch() {
  searchQuery = '';
  renderTopicList();
}

function toggleTag(tag) {
  if (activeTags.includes(tag)) {
    activeTags = activeTags.filter((item) => item !== tag);
  } else {
    activeTags.push(tag);
  }
  renderTopicList();
}

function clearFilters() {
  activeTags = [];
  renderTopicList();
}

function topicMatchesFilters(topic) {
  const keywords = searchQuery.trim().split(/\s+/).filter(Boolean);
  const caseItems = appData.cases.filter((item) => item.topicId === topic.id);
  const tagsMatch = activeTags.length
    ? caseItems.some((item) => item.tags.some((tag) => activeTags.includes(tag)))
    : true;
  const searchMatch = keywords.every((keyword) => {
    const lower = keyword.toLowerCase();
    const topicFields = [topic.title, topic.description, ...(topic.tags || [])];
    const topicHit = topicFields.some((field) => field && field.toLowerCase().includes(lower));
    const caseHit = caseItems.some((caseItem) => {
      const convText = (caseItem.conversations || []).map((c) => c.question + ' ' + c.answer).join(' ');
      const fields = [caseItem.title, caseItem.author, caseItem.gameName, caseItem.productName || '', ...(caseItem.tags || []), convText, caseItem.sections?.designPurpose, caseItem.sections?.implementation, caseItem.sections?.output, caseItem.sections?.obstacles, caseItem.sections?.actualEffect, caseItem.sections?.lessonsLearned];
      return fields.some((field) => field && field.toLowerCase().includes(lower));
    });
    return topicHit || caseHit;
  });
  return tagsMatch && searchMatch;
}

function renderTopicDetail(topicId) {
  const app = document.getElementById('app');
  const topic = appData.topics.find((item) => item.id === topicId);
  if (!topic) {
    app.innerHTML = '<div class="empty-state">⚠️ 专题不存在<div style="margin-top:12px;"><a href="#" class="back-button">返回首页</a></div></div>';
    return;
  }
  const caseItems = appData.cases.filter((item) => item.topicId === topicId);
  const caseCards = caseItems.map((caseItem) => {
    const excerpt = caseItem.conversations && caseItem.conversations.length > 0
      ? (caseItem.conversations[0].answer || '').slice(0, 100)
      : (caseItem.sections?.designPurpose || '').slice(0, 100);
    return `
      <div class="case-card" onclick="location.hash='case=${caseItem.id}'">
        <h3>${caseItem.title}</h3>
        <div class="case-meta">
          <span>✍️ ${caseItem.author}</span>
          <span>🎮 ${caseItem.productName || caseItem.gameName}</span>
        </div>
        <div class="case-excerpt">${excerpt}${excerpt.length >= 100 ? '...' : ''}</div>
        <div class="case-tags">${caseItem.tags.map((tag) => '<span class="case-tag">' + tag + '</span>').join('')}</div>
        ${getInteractionBarHtml(caseItem.id)}
      </div>
    `;
  }).join('');

  app.innerHTML = `
    <div class="topic-detail">
      <div class="topic-detail-header">
        <a class="back-button" href="#">← 返回首页</a>
        <h2>${topic.title}</h2>
        <p style="color: var(--text-secondary); margin-top:6px;">${topic.description}</p>
        <div class="topic-meta" style="margin-top:10px;">
          <span>📅 ${topic.publishDate}</span>
          <span>📁 ${caseItems.length} 个案例</span>
        </div>
        <div class="topic-tags">${topic.tags.map((tag) => '<span class="topic-tag">' + tag + '</span>').join('')}</div>
      </div>
      <div class="case-grid">${caseCards || '<div class="empty-state">本期暂无案例投稿</div>'}</div>
      <div class="discussion">
        <h3>💬 讨论纪要</h3>
        <div>${topic.discussionSummary ? formatText(topic.discussionSummary) : '本期讨论纪要整理中...'}</div>
      </div>
    </div>
  `;
  caseItems.forEach((caseItem) => updateInteractionButtons(caseItem.id));
}

function showCase(caseId) {
  const caseItem = appData.cases.find((item) => item.id === caseId);
  if (!caseItem) return;
  const topic = appData.topics.find((item) => item.id === caseItem.topicId);
  const modal = document.getElementById('caseModal');
  const title = document.getElementById('caseModalTitle');
  const body = document.getElementById('caseModalBody');

  title.textContent = caseItem.title;
  const avatarChar = (caseItem.author || '?').charAt(0);

  // Extract guide (导读) if present as first conversation
  let guideHtml = '';
  let conversations = caseItem.conversations || [];
  if (conversations.length > 0 && conversations[0].question === '导读') {
    const guideLines = (conversations[0].answer || '').split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const guideParagraphs = guideLines.map((line) => {
      const bolded = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      if (line.startsWith('- ')) {
        return '<p style="padding-left:1.2em;text-indent:-1.2em;">\u2022 ' + bolded.slice(2) + '</p>';
      }
      return '<p>' + bolded + '</p>';
    }).join('');
    guideHtml = '<div class="case-guide">' + guideParagraphs + '</div>';
    conversations = conversations.slice(1);
  }

  const headerHtml = `
    <div class="case-detail-header">
      <h2>${caseItem.title}</h2>
      <div class="case-detail-meta">
        <span>✍️ 分享人：${caseItem.author}</span>
        ${caseItem.productName ? '<span>🎮 产品：' + caseItem.productName + '</span>' : '<span>🎮 ' + (caseItem.gameName || '') + '</span>'}
        ${caseItem.productType ? '<span>📋 类型：' + caseItem.productType + '</span>' : ''}
        <span>📁 <a href="#topic=${caseItem.topicId}" style="color:var(--primary);text-decoration:none;">${topic ? topic.title : ''}</a></span>
      </div>
      <div class="case-tags" style="margin-top:12px;">${(caseItem.tags || []).map((tag) => '<span class="case-tag">' + tag + '</span>').join('')}</div>
      ${guideHtml}
    </div>
  `;

  let contentHtml = '';

  if (conversations && conversations.length > 0) {
    const chatHtml = conversations.map((qa, index) => {
      const answerParagraphs = (() => {
        const lines = (qa.answer || '').split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
        const result = [];
        let blockquoteBuffer = [];
        const flushBlockquote = () => {
          if (blockquoteBuffer.length > 0) {
            const html = blockquoteBuffer.map((bl) => {
              // Bold: **text** -> <strong>text</strong>
              const bolded = bl.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
              if (bl.startsWith('- ')) {
                return '<p class="insight-li">\u2022 ' + bolded.slice(2) + '</p>';
              }
              return '<p>' + bolded + '</p>';
            }).join('');
            result.push('<blockquote class="chat-insight">' + html + '</blockquote>');
            blockquoteBuffer = [];
          }
        };
        for (const line of lines) {
          if (line.startsWith('> ')) {
            blockquoteBuffer.push(line.slice(2));
          } else {
            flushBlockquote();
            if (line.startsWith('- ')) {
              result.push('<p style="padding-left:1em;text-indent:-1em;">\u2022 ' + line.slice(2) + '</p>');
            } else {
              result.push('<p>' + line + '</p>');
            }
          }
        }
        flushBlockquote();
        return result.join('');
      })();

      const imagesHtml = (qa.images && qa.images.length > 0)
        ? '<div class="chat-images">' + qa.images.map((src) => '<img src="' + src + '" alt="分享图片" loading="lazy">').join('') + '</div>'
        : '';

      return `
        <div class="chat-pair">
          <div class="chat-q-index">Q${index + 1}</div>
          <div class="chat-question">
            <div class="chat-question-bubble">
              <p>${qa.question}</p>
            </div>
          </div>
          <div class="chat-answer">
            <div class="chat-answer-content">
              <div class="chat-answer-label">${caseItem.author}</div>
              <div class="chat-answer-bubble">
                ${answerParagraphs}
              </div>
              ${imagesHtml}
            </div>
            <div class="chat-avatar">${avatarChar}</div>
          </div>
        </div>
      `;
    }).join('');
    contentHtml = '<div class="chat-container"><div class="chat-timeline">' + chatHtml + '</div></div>';
  } else if (caseItem.sections) {
    contentHtml = `
      <div style="padding: 20px 22px;">
        <div class="section-block"><h3>🎯 设计目的/出发点</h3><div>${formatText(caseItem.sections?.designPurpose)}</div></div>
        <div class="section-block"><h3>🔧 实现手段</h3><div>${formatText(caseItem.sections?.implementation)}</div></div>
        <div class="section-block"><h3>📦 产出概况</h3><div>${formatText(caseItem.sections?.output)}</div></div>
        <div class="section-block"><h3>⚠️ 阻碍难点</h3><div>${formatText(caseItem.sections?.obstacles)}</div></div>
        <div class="section-block"><h3>📊 实际效果</h3><div>${formatText(caseItem.sections?.actualEffect)}</div></div>
        <div class="section-block"><h3>💡 经验总结</h3><div>${formatText(caseItem.sections?.lessonsLearned)}</div></div>
      </div>
    `;
  } else {
    contentHtml = '<div class="empty-state">暂无内容</div>';
  }

  body.innerHTML = headerHtml + contentHtml + '<div style="padding: 0 24px 24px;">' + getInteractionBarHtml(caseItem.id) + '<div class="comment-placeholder">💬 评论功能即将上线，敬请期待</div></div>';
  modal.classList.remove('hidden');
  updateInteractionButtons(caseItem.id);
}

function renderProfile() {
  const app = document.getElementById('app');
  const nickname = storage.get('roundtable_nickname') || '匿名';
  const avatarChar = nickname.charAt(0);
  const bookmarks = getBookmarks();
  const myCases = appData.cases.filter((item) => item.author === nickname);
  const involvedTopics = new Set(myCases.map((item) => item.topicId));

  const myCaseCards = myCases.length
    ? myCases.map((caseItem) => profileCaseCard(caseItem)).join('')
    : '<div class="empty-state">暂无投稿记录</div>';

  const bookmarkCases = appData.cases.filter((item) => bookmarks.includes(item.id));
  const bookmarkCards = bookmarkCases.length
    ? bookmarkCases.map((caseItem) => profileCaseCard(caseItem)).join('')
    : '<div class="empty-state">还没有收藏任何案例</div>';

  const emptySubmit = '<div class="empty-state-rich"><div class="empty-icon">📝</div><div class="empty-title">暂无投稿记录</div><div class="empty-hint">参与圆桌专题讨论后，你的案例将展示在这里</div></div>';
  const emptyBookmark = '<div class="empty-state-rich"><div class="empty-icon">⭐</div><div class="empty-title">还没有收藏</div><div class="empty-hint">浏览案例时点击收藏，方便后续回顾</div></div>';

  app.innerHTML = `
    <div class="profile">
      <div class="profile-header">
        <div class="profile-avatar">${avatarChar}</div>
        <div class="profile-info">
          <h2>${nickname}</h2>
          <div class="profile-actions">
            <button onclick="showChangeNickname()">✏️ 修改花名</button>
          </div>
        </div>
        <div class="profile-stats-bar">
          <div class="profile-stat-item">
            <div class="profile-stat-num">${myCases.length}</div>
            <div class="profile-stat-label">投稿</div>
          </div>
          <div class="profile-stat-divider"></div>
          <div class="profile-stat-item">
            <div class="profile-stat-num">${involvedTopics.size}</div>
            <div class="profile-stat-label">参与期数</div>
          </div>
          <div class="profile-stat-divider"></div>
          <div class="profile-stat-item">
            <div class="profile-stat-num">${bookmarks.length}</div>
            <div class="profile-stat-label">收藏</div>
          </div>
        </div>
      </div>

      <div class="utility-section">
        <div class="section-label">📝 我的投稿</div>
        <div class="case-grid">${myCaseCards || emptySubmit}</div>
      </div>

      <div class="utility-section">
        <div class="section-label">⭐ 我的收藏</div>
        <div class="case-grid">${bookmarkCards || emptyBookmark}</div>
      </div>
    </div>
  `;

  [...myCases, ...bookmarkCases].forEach((caseItem) => updateInteractionButtons(caseItem.id));
}

function profileCaseCard(caseItem) {
  const excerpt = caseItem.conversations && caseItem.conversations.length > 0
    ? (caseItem.conversations[0].answer || '')
    : (caseItem.sections?.designPurpose || '');
  return `
    <div class="case-card" onclick="location.hash='case=${caseItem.id}'">
      <h3>${caseItem.title}</h3>
      <div class="case-meta">
        <span>✍️ ${caseItem.author}</span>
        <span>🎮 ${caseItem.productName || caseItem.gameName}</span>
      </div>
      <div class="case-excerpt">${excerpt.slice(0, 80)}...</div>
      <div class="case-tags">${caseItem.tags.map((tag) => `<span class="case-tag">${tag}</span>`).join('')}</div>
      ${getInteractionBarHtml(caseItem.id)}
    </div>
  `;
}

function showChangeNickname() {
  const overlay = document.getElementById('nicknameOverlay');
  const input = document.getElementById('nicknameInput');
  const nickname = storage.get('roundtable_nickname') || '';
  input.value = nickname;
  overlay.classList.remove('hidden');
}

function closeModal() {
  const modal = document.getElementById('caseModal');
  modal.classList.add('hidden');
  if (window.location.hash.startsWith('#case=')) {
    const caseId = window.location.hash.replace('#case=', '');
    const caseItem = appData?.cases.find((item) => item.id === caseId);
    if (caseItem) {
      window.location.hash = `#topic=${caseItem.topicId}`;
    } else {
      window.location.hash = '#';
    }
  }
}

const caseModalElement = document.getElementById('caseModal');
if (caseModalElement) {
  caseModalElement.addEventListener('click', (event) => {
    if (event.target.id === 'caseModal') {
      closeModal();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const modal = document.getElementById('caseModal');
    if (modal && !modal.classList.contains('hidden')) {
      closeModal();
    }
  }
});

function getUniqueAuthors() {
  return [...new Set(appData.cases.map((item) => item.author))];
}
