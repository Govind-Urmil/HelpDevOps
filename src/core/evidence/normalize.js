export const LIMITS = Object.freeze({ maxBytes: 64 * 1024, maxLines: 5000, maxLineChars: 16 * 1024 });

export function normalizeEvidenceInput(value) {
  const input = typeof value === 'string' ? value : '';
  const bytes = new TextEncoder().encode(input).byteLength;
  if (bytes > LIMITS.maxBytes) return { ok:false, reason:'Input exceeds the 64 KB evidence limit.' };
  const withoutAnsi = input.replace(/\u001B(?:\[[0-?]*[ -/]*[@-~]|\][^\u0007]*(?:\u0007|\u001B\\))/g, '');
  const text = withoutAnsi.replace(/\r\n?/g, '\n').trim();
  const lines = text ? text.split('\n') : [];
  if (lines.length > LIMITS.maxLines) return { ok:false, reason:'Input exceeds the 5,000-line evidence limit.' };
  if (lines.some(line => line.length > LIMITS.maxLineChars)) return { ok:false, reason:'One or more lines exceed the 16 KB line limit.' };
  return { ok:true, text, lines };
}
