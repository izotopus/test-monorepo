export const logger = {
  log: (msg: string, data?: any) => {
    console.log(`[LOG][${new Date().toISOString()}] ${msg}`, data || '');
  },
  error: (msg: string, error?: any) => {
    console.error(`[ERR][${new Date().toISOString()}] ${msg}`, error || '');
    // Tu w przyszłości dodasz wysyłkę do Sentry / Axiom / Twojego API
  },
  warn: (msg: string, data?: any) => {
    console.warn(`[WRN][${new Date().toISOString()}] ${msg}`, data || '');
  }
};