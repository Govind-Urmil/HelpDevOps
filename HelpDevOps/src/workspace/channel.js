const CHANNEL = 'helpdevops-workspace-v1';
export function createWorkspaceChannel(onMessage) {
  const key = `${CHANNEL}:event`;
  const handler = event => { if (event.key === key && event.newValue) onMessage(JSON.parse(event.newValue)); };
  globalThis.addEventListener?.('storage', handler);
  const channel = 'BroadcastChannel' in globalThis ? new BroadcastChannel(CHANNEL) : null;
  if (channel) channel.onmessage = event => onMessage(event.data);
  return {
    post(message) {
      try {
        localStorage.setItem(key, JSON.stringify({ ...message, nonce: crypto.randomUUID() }));
        localStorage.removeItem(key);
      } catch { channel?.postMessage(message); }
    },
    close() { globalThis.removeEventListener?.('storage', handler); channel?.close(); }
  };
}
