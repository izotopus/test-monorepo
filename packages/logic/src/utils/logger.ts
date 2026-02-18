
const LOG_SERVER_URL = 'http://localhost:9999';

const sendToServer = async (payload: any) => {
  const isLocalhost = 
    typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  const isDev = (import.meta as any)?.env?.DEV || (import.meta as any)?.env?.MODE === 'development' || isLocalhost;

  if (!isDev) return;

  try {
    fetch(LOG_SERVER_URL, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) { }
};

export const createLogger = (appName: string) => {
  const log = (level: string, category: string, message: string, data?: any) => {
    console.log(`[${appName}][${level}] <${category}> ${message}`, data || '');

    sendToServer({ app: appName, level, category, message, data });
  };

  return {
    debug: (cat: string, msg: string, d?: any) => log('DEBUG', cat, msg, d),
    info: (cat: string, msg: string, d?: any) => log('INFO', cat, msg, d),
    warn: (cat: string, msg: string, d?: any) => log('WARN', cat, msg, d),
    error: (cat: string, msg: string, d?: any) => log('ERROR', cat, msg, d),
    critical: (cat: string, msg: string, d?: any) => log('CRITICAL', cat, msg, d),
  };
};