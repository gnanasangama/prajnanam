export {};

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetIdOrEventName: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

