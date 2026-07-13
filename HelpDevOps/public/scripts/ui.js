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
  results.innerHTML = '<p class="muted">Search available tools, pages, and planned platform areas.</p>';
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
  results.innerHTML = matches.length ? matches.map(([name,description,path]) => `<a href="${path}"><strong>${name}</strong><span>${description}</span></a>`).join('') : '<p><strong>No matching tool or page.</strong><br><span class="muted">Try cron, JSON, YAML, tools, guides, or privacy.</span></p>';
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
