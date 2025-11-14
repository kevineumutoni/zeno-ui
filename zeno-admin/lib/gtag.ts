export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export interface GtagEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}


declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      params?: Record<string, unknown>
    ) => void;
  }
}


export const pageview = (url: string) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }: GtagEvent) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined' || !window.gtag) return;

  const params: Record<string, unknown> = {};

  if (category) params.event_category = category;
  if (label) params.event_label = label;
  if (typeof value === 'number') params.value = value;

  window.gtag('event', action, params);
};
