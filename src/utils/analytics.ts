export const GA_MEASUREMENT_ID = 'G-TNM4Z1XVSE'; // replace with your ID

export const pageview = (url: string) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

export const trackEvent = (
  action: string,
  params: {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: string | number | boolean | undefined;
  }
) => {
  window.gtag('event', action, params);
};
