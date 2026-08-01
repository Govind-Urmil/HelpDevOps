const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

$('.skip-link')?.addEventListener('click', () => {
  requestAnimationFrame(() => $('#main-content')?.focus());
});

const menuButton = $('[data-menu-trigger]');
const mobileNav = $('#mobile-nav');
const closeMenu = ({ restore = false } = {}) => {
  if (!menuButton || !mobileNav) return;
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  if (restore) menuButton.focus();
};
menuButton?.addEventListener('click', () => {
  const opening = mobileNav.hidden;
  mobileNav.hidden = !opening;
  menuButton.setAttribute('aria-expanded', String(opening));
  document.body.classList.toggle('menu-open', opening);
  if (opening) $('a', mobileNav)?.focus();
});
document.addEventListener('click', event => {
  if (!mobileNav?.hidden && !event.target.closest('.site-header')) closeMenu();
});

const dialog = $('[data-search-dialog]');
const searchInput = $('[data-search-input]');
const results = $('[data-search-results]');
let priorFocus;
const searchIndex = dialog ? JSON.parse(dialog.dataset.searchIndex || '[]') : [];
const openSearch = trigger => {
  if (!dialog) return;
  priorFocus = trigger || document.activeElement;
  dialog.showModal();
  searchInput.value = '';
  results.innerHTML = '<p class="muted">Search tools, diagnostics, interpreters, references, errors, and hubs.</p>';
  searchInput.focus();
};
const closeSearch = () => {
  if (!dialog?.open) return;
  dialog.close();
};
$$('[data-search-open]').forEach(button => button.addEventListener('click', () => openSearch(button)));
$('[data-search-close]')?.addEventListener('click', closeSearch);
dialog?.addEventListener('click', event => { if (event.target === dialog) closeSearch(); });
dialog?.addEventListener('cancel', event => { event.preventDefault(); closeSearch(); });
dialog?.addEventListener('close', () => setTimeout(() => priorFocus?.focus?.(), 0));
searchInput?.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) { results.innerHTML = '<p class="muted">Enter a page, domain, or task. Your query stays in this tab.</p>'; return; }
  const normalize = value => String(value || '').toLowerCase().replace(/[^a-z0-9.+#/-]+/g, ' ').trim();
  const corrections = { kubernets:'kubernetes', kubernettes:'kubernetes', terrafrom:'terraform', teraform:'terraform', docer:'docker', dockr:'docker', jenkens:'jenkins', permision:'permission', crashloopbackof:'crashloopbackoff', imagepullbackof:'imagepullbackoff' };
  const normalizedQuery = normalize(query).split(/\s+/).filter(Boolean).map(token => corrections[token] || token).join(' ');
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const matches = searchIndex.map(item => {
    const title = normalize(item.title); const aliases=(item.aliases||[]).map(normalize); const errors=(item.exactErrors||[]).map(normalize); const hay=normalize(item.search||[item.title,item.domain,item.summary,...(item.aliases||[]),...(item.exactErrors||[])].join(' '));
    let score=0,why=''; if(title===normalizedQuery){score=item.type==='ERROR'?88:100;why='exact title';}else if(errors.includes(normalizedQuery)){score=96;why='exact reviewed error';}else if(aliases.includes(normalizedQuery)){score=({DIAGNOSTIC:94,INTERPRETER:93,TOOL:92,REFERENCE:85,ERROR:86,HUB:84}[item.type]||90);why='alias';}else if(item.type==='DIAGNOSTIC'&&title.split(/\s+/).includes(normalizedQuery)){score=89;why='title token';}else if(title.startsWith(normalizedQuery)){score=80;why='title prefix';}else if(tokens.every(t=>hay.includes(t))){score=60+tokens.length;why=normalizedQuery===normalize(query)?'matching terms':'corrected common spelling';}else if(tokens.some(t=>hay.includes(t))){score=20;why='partial term';} return {...item,score,why};
  }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score||a.title.localeCompare(b.title)).slice(0,12);
  const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  results.innerHTML = matches.length ? matches.map(item => `<a href="${escape(item.route)}"><span class="eyebrow">${escape(item.type)} · ${escape(item.domain || 'platform')}</span><strong>${escape(item.title)}</strong><span>${escape(item.summary)}</span><small>Matched: ${escape(item.why)}</small></a>`).join('') : `<div class="search-empty"><p><strong>No reviewed destination matched “${escape(query)}”.</strong></p><p class="muted">Try a broader symptom such as “permission denied”, a technology name, an exact error fragment, or a command. No approximate result was fabricated.</p><p><a href="/#analyze">Analyze redacted evidence</a> · <a href="/troubleshoot/">Browse investigations</a> · <a href="/tools/">Browse tools</a></p><p class="muted">Common areas: Kubernetes, Docker, Terraform, Git, Jenkins, Linux, networking, and Cron.</p></div>`;
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && dialog?.open) {
    event.preventDefault();
    closeSearch();
    return;
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    const shortcutOrigin = document.activeElement?.matches?.('[data-search-open]') ? document.activeElement : $('[data-search-open]');
    openSearch(shortcutOrigin);
  }
  if (event.key === 'Escape' && !mobileNav?.hidden) closeMenu({ restore:true });
});

const dock = $('[data-session-dock]');
let dockPriorFocus;
$$('[data-session-open]').forEach(button => button.addEventListener('click', () => { dockPriorFocus = button; dock.hidden = false; dock.focus?.(); }));
$('[data-session-close]')?.addEventListener('click', () => { dock.hidden = true; dockPriorFocus?.focus?.(); });
