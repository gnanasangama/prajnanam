export const GA_MEASUREMENT_ID = 'G-TNM4Z1XVSE';

export const pageview = (url: string, pageName?: string) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: pageName,
    });
  }
};

export const trackEvent = (
  action: string,
  params: {
    event_category?: string;
    event_label?: string;
    value?: number;
    page_name?: string;
    [key: string]: string | number | boolean | undefined;
  }
) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag('event', action, {
      ...params,
      send_to: GA_MEASUREMENT_ID
    });
  }
};