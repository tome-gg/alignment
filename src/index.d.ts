declare global {
  interface Window {
    gtag: Gtag.Gtag;
  }
}

export namespace Gtag {
  type Currency = string;
  type EventParams = {
    event_category?: string;
    event_label?: string;
    value?: number;
  };

  type Gtag = {
    (command: 'config', targetId: string, config?: ControlParams | EventParams): void;
    (command: 'set', targetId: string, config: ControlParams | EventParams): void;
    (command: 'event', eventName: string, eventParams?: EventParams): void;
  };

  interface ControlParams {
    groups?: string;
    send_to?: string;
    event_callback?: () => void;
    event_timeout?: number;
  }
}