export type GlobalMessageType = 'success' | 'error' | 'info';

export interface GlobalMessage {
  type: GlobalMessageType;
  content: string;
}

const MESSAGE_KEY = 'globalMessage';

export const pushGlobalMessage = (message: GlobalMessage) => {
  sessionStorage.setItem(MESSAGE_KEY, JSON.stringify(message));
};

export const popGlobalMessage = (): GlobalMessage | null => {
  const raw = sessionStorage.getItem(MESSAGE_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(MESSAGE_KEY); // 1회성
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};
