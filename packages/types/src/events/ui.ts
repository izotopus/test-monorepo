
export const UI_EVENTS = {
  FORM_CHANGE: 'form-change',
  // UI_CHANGE: 'ui-change',
  // MODAL_CLOSE: 'modal-close'
} as const;

export interface UIEventPayloads {
  [UI_EVENTS.FORM_CHANGE]: Record<string, any>;
  // [UI_EVENTS.UI_CHANGE]: string | number;
  // [UI_EVENTS.MODAL_CLOSE]: void;
}
