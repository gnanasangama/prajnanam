// src/types/global.d.ts
export {};

declare global {
    interface Window {
        gtag: (
            command: 'event',
            eventName: string,
            eventParameters: {
                event_category: string;
                event_label: string;
                [key: string]: unknown;
            }
        ) => void;
    }
}
