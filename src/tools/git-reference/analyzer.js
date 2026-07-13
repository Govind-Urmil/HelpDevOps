const forbidden = /[ ~^:?*\[\\\x00-\x1f\x7f]/;
export function validateRef(input, context = 'branch') {
  const value = input, diagnostics = [];
  if (!value) diagnostics.push('Name is empty.');
  if (context === 'branch' && value.startsWith('-')) diagnostics.push('Branch names cannot start with a dash.');
  if (context === 'branch' && value === 'HEAD') diagnostics.push('HEAD is reserved and cannot be used as a branch name.');
  if (value.startsWith('/') || value.endsWith('/')) diagnostics.push('Leading or trailing slash is not allowed.');
  if (value.includes('//')) diagnostics.push('Repeated slash is not allowed.');
  if (value.includes('..')) diagnostics.push('Consecutive dots are not allowed.');
  if (value.includes('@{')) diagnostics.push('The literal @{ sequence is not allowed.');
  if (forbidden.test(value)) diagnostics.push('The name contains a forbidden character, space, or control character.');
  if (value.endsWith('.')) diagnostics.push('A ref cannot end with a dot.');
  if (value.split('/').some((part) => part.startsWith('.') || part.endsWith('.lock'))) diagnostics.push('Components cannot start with a dot or end with .lock.');
  if (context === 'full' && !value.startsWith('refs/')) diagnostics.push('A fully qualified ref must start with refs/.');
  return { status: diagnostics.length ? 'invalid' : 'valid', kind: 'git-ref', title: diagnostics.length ? 'Git reference has diagnostics' : 'Git reference syntax is valid for the selected context', diagnostics, checked: ['Git reference syntax only'], notChecked: ['Repository existence, resolution, case collisions, and remote state'] };
}
export function suggestRef(input, { lowercase = false } = {}) {
  let value = input.trim(); const changes = [];
  const apply = (next, label) => { if (next !== value) { value = next; changes.push(label); } };
  apply(value.replace(/\s+/g, '-'), 'replaced spaces with hyphens');
  apply(value.replace(/\/{2,}/g, '/'), 'collapsed repeated slashes');
  apply(value.replace(/-+/g, '-'), 'collapsed repeated hyphens');
  apply(value.replace(/[~^:?*\[\\\x00-\x1f\x7f]/g, ''), 'removed forbidden characters');
  apply(value.replace(/^\/+|[/.]+$/g, ''), 'removed leading/trailing slash or dot');
  if (lowercase) apply(value.toLowerCase(), 'converted to lowercase by explicit request');
  return { original: input, suggestion: value, changes, remaining: validateRef(value).diagnostics };
}
export function explainRevision(value) {
  let type;
  if (value === 'HEAD') type = 'HEAD';
  else if (/^[A-Za-z0-9._/-]+\.\.\.?[A-Za-z0-9._/-]+$/.test(value)) type = value.includes('...') ? 'symmetric range' : 'two-dot range';
  else if (/^refs\/(heads|tags)\/[A-Za-z0-9._/-]+$/.test(value)) type = 'fully qualified ref';
  else if (/^[0-9a-fA-F]{4,40}$/.test(value)) type = 'object-like hexadecimal token';
  else if (/^[A-Za-z0-9._/-]+(?:~\d+|\^\d*)$/.test(value)) type = 'ref-relative expression';
  else if (/^[A-Za-z0-9._/-]+$/.test(value)) type = 'simple ref name';
  else return { status: 'unsupported', kind: 'git-revision', title: 'Revision syntax outside the supported subset', summary: 'This expression may use Git revision syntax outside the currently supported explanation subset.' };
  return { status: 'recognized', kind: 'git-revision', title: type, summary: 'This resembles supported Git revision syntax. Repository resolution was not performed.', checked: ['Syntax shape'], notChecked: ['Repository existence, object resolution, and commit graph'] };
}
