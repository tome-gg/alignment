// Google Analytics utility functions

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: object) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-9P755HMHC8';

// Track a custom event
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track calendar cell selection
export const trackCalendarCellSelection = (date: Date, value: number) => {
  trackEvent(
    'calendar_cell_selected',
    'calendar_interaction',
    date.toISOString().split('T')[0], // Date in YYYY-MM-DD format
    Math.round(value * 10000) // Convert percentage to basis points for value
  );
};
