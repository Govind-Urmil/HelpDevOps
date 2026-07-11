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
const searchIndex = [
  ['Command Center','Private DevOps task starting point','/'],['Tools','Platform and tool status','/tools/'],
  ['Workspace','Local continuity preview','/workspace/'],['Preflight','Cross-file workflow preview','/preflight/'],
  ['Guides','Problem-first guidance status','/guides/'],['References','Concise reference status','/references/'],
  ['Privacy','Input and privacy behavior','/privacy/'],['About','Mission and architecture','/about/']
];
const openSearch = trigger => {
  if (!dialog) return;
  priorFocus = trigger || document.activeElement;
  dialog.showModal();
  searchInput.value = '';
  results.innerHTML = '<p class="muted">Search pages and platform areas. Production tool indexing arrives with future tools.</p>';
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
  const matches = searchIndex.filter(item => item.slice(0,2).join(' ').toLowerCase().includes(query));
  results.innerHTML = matches.length ? matches.map(([name,description,path]) => `<a href="${path}"><strong>${name}</strong><span>${description}</span></a>`).join('') : '<p><strong>No matching page.</strong><br><span class="muted">Production tool search is not available yet.</span></p>';
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

$('[data-universal-action]')?.addEventListener('click', () => {
  const notice = $('[data-input-notice]');
  notice.hidden = false; notice.focus();
});
const dock = $('[data-session-dock]');
$('[data-session-open]')?.addEventListener('click', () => { dock.hidden = false; dock.focus?.(); });
$('[data-session-close]')?.addEventListener('click', () => { dock.hidden = true; $('[data-session-open]')?.focus(); });
