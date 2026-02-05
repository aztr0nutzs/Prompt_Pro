const views = {
  library: document.getElementById('view-library'),
  editor: document.getElementById('view-editor'),
  favorites: document.getElementById('view-favorites'),
  about: document.getElementById('view-about'),
};

function setView(name){
  Object.values(views).forEach(v => v.classList.remove('active'));
  views[name].classList.add('active');
}

document.getElementById('navTabs').addEventListener('click', (e) => {
  const a = e.target.closest('a[data-view]');
  if(!a) return;
  e.preventDefault();
  setView(a.dataset.view);
});

const currentPathEl = document.getElementById('currentPath');
const editorEl = document.getElementById('editor');
const editorTitleEl = document.getElementById('editorTitle');
const libraryListEl = document.getElementById('libraryList');
const searchInputEl = document.getElementById('searchInput');
const filterChipsEl = document.getElementById('filterChips');

let promptIndex = [];
let activeCats = new Set(['SYSTEM_PROMPTS','CRITICAL_REVIEW','DEBUGGING']);
let selected = null; // { path, file, cat }

function catFromPath(path){
  // Expected format: /CATEGORY/...
  const parts = path.split('/').filter(Boolean);
  return (parts[0] || 'UNKNOWN').toUpperCase();
}

function titleFromPath(path){
  const parts = path.split('/').filter(Boolean);
  return parts[parts.length - 1] || path;
}

function matchesFilters(item, query){
  const cat = item.cat;
  if(!activeCats.has(cat)) return false;
  if(!query) return true;
  const q = query.toLowerCase();
  return (
    item.path.toLowerCase().includes(q) ||
    item.cat.toLowerCase().includes(q) ||
    (item.name || '').toLowerCase().includes(q)
  );
}

function renderLibrary(){
  const query = (searchInputEl.value || '').trim();
  const filtered = promptIndex.filter(i => matchesFilters(i, query));

  libraryListEl.innerHTML = '';
  if(filtered.length === 0){
    const empty = document.createElement('div');
    empty.textContent = 'No prompts match your filters.';
    libraryListEl.appendChild(empty);
    return;
  }

  for(const item of filtered){
    const li = document.createElement('li');
    li.className = 'pf-card';
    li.dataset.cat = item.cat;

    const h4 = document.createElement('h4');
    h4.textContent = item.name || titleFromPath(item.path);

    const meta = document.createElement('div');
    meta.className = 'pf-meta';
    meta.innerHTML = `
      <span class="pf-badge">${item.cat}</span>
      <span class="pf-badge">${item.path}</span>
    `;

    const openBtn = document.createElement('a');
    openBtn.href = '#';
    openBtn.className = 'btn';
    openBtn.innerHTML = '<span>OPEN</span>';
    openBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await openPrompt(item);
    });

    li.appendChild(h4);
    li.appendChild(meta);
    li.appendChild(openBtn);
    libraryListEl.appendChild(li);
  }
}

async function openPrompt(item){
  currentPathEl.textContent = item.path;
  editorTitleEl.textContent = `EDITOR: ${item.path}`;
  const text = await fetch(item.file).then(r => r.text());
  editorEl.value = text;
  selected = item;
  setView('editor');
}

filterChipsEl.addEventListener('click', (e) => {
  const chip = e.target.closest('.pf-chip');
  if(!chip) return;
  const cat = chip.dataset.filter;
  const pressed = chip.getAttribute('aria-pressed') === 'true';
  chip.setAttribute('aria-pressed', String(!pressed));
  if(pressed) activeCats.delete(cat);
  else activeCats.add(cat);
  renderLibrary();
});

searchInputEl.addEventListener('input', () => renderLibrary());

document.getElementById('btnRun').addEventListener('click', (e) => {
  e.preventDefault();
  // "Run" is intentionally a UX affordance. Actual model execution depends on integration.
  alert('RUN is a placeholder in the offline build. Hook this to your model runner/API later.');
});

document.getElementById('btnSave').addEventListener('click', (e) => {
  e.preventDefault();
  if(!selected){
    alert('Open a prompt first.');
    return;
  }
  // Offline browser cannot write to disk. We store an override in localStorage.
  localStorage.setItem('pf_override:' + selected.path, editorEl.value);
  alert('Saved locally (browser storage) for: ' + selected.path);
});

document.getElementById('btnExport').addEventListener('click', (e) => {
  e.preventDefault();
  if(!selected){
    alert('Open a prompt first.');
    return;
  }
  const blob = new Blob([editorEl.value], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (selected.path.split('/').filter(Boolean).join('_') || 'prompt') + '.md';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

async function loadLibrary(){
  const res = await fetch('data/index.json');
  const raw = await res.json();

  // Enrich index items with category + display name
  promptIndex = raw.map(item => ({
    ...item,
    cat: item.cat || catFromPath(item.path),
    name: item.name || titleFromPath(item.path).replace(/[-_]+/g, ' '),
  }));

  // Apply local overrides if present (lazy-load during openPrompt)
  // (We keep it minimal here to avoid fetching all prompt files upfront.)

  renderLibrary();
}

loadLibrary();
