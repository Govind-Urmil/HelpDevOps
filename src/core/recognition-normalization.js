const META_TERMS=/\b(?:guide|documentation|docs|article|phrase|term|acronym|metaphor|tutorial|training|overview|diagram|roadmap|proposal|planning|discussion)\b/i;
export const normalizeInput=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/[“”‘’]/g,"'").replace(/\s+/g,' ').trim();
export const escapePattern=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export const boundaryMatch=(input,signature)=>{const text=normalizeInput(input),term=normalizeInput(signature);return Boolean(term)&&new RegExp(`(^|[^a-z0-9])${escapePattern(term)}([^a-z0-9]|$)`,'i').test(text)};
export const tokenize=value=>normalizeInput(value).match(/[a-z0-9]+(?:[._/-][a-z0-9]+)*/g)||[];
export const isMetaDiscussion=value=>META_TERMS.test(value)&&tokenize(value).length>=3;
export const mentionedTechnologies=value=>{const text=normalizeInput(value),ids=[];for(const [id,re] of Object.entries({kubernetes:/\b(?:kubernetes|k8s|kubectl|pod)\b/,docker:/\bdocker\b/,linux:/\b(?:linux|chmod|systemd)\b/,git:/\bgit\b/,terraform:/\bterraform\b/,jenkins:/\bjenkins\b/,networking:/\b(?:network|dns|tcp|tls|http)\b/}))if(re.test(text))ids.push(id);return ids};
