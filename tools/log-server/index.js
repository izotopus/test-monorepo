const http = require('http');
const readline = require('readline');

const PORT = 9999;
const MENU_SIZE = 7;

const state = {
  apps: {
    'astro': { enabled: true, color: '\x1b[35m' },
    'UI': { enabled: true, color: '\x1b[37m' },
    'dashboard': { enabled: true, color: '\x1b[36m' },
    'task-manager': { enabled: true, color: '\x1b[34m' },
    'analytics': { enabled: true, color: '\x1b[32m' },
    'event-bus': { enabled: true, color: '\x1b[33m' },
  },
  minLevel: 0
};

const LOG_LEVELS = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL'];
const COLORS = {
  DEBUG: '\x1b[90m', INFO: '\x1b[32m', WARN: '\x1b[33m', 
  ERROR: '\x1b[31m', CRITICAL: '\x1b[41m\x1b[37m', RESET: '\x1b[0m',
  BORDER: '\x1b[90m', MENU_TEXT: '\x1b[37m'
};

function drawMenu() {
  process.stdout.write('\x1b[s'); 
  process.stdout.write('\x1b[1;1H'); 
  
  process.stdout.write(`${COLORS.BORDER}================================================================${COLORS.RESET}\n`);
  process.stdout.write(`${COLORS.MENU_TEXT}  MFE CENTRAL LOG SERVER - Port: ${PORT} ${COLORS.RESET}\n`);
  process.stdout.write(`${COLORS.BORDER}================================================================${COLORS.RESET}\n`);
  
  const appKeys = Object.keys(state.apps);
  let menuLine = '  ';
  appKeys.forEach((key, i) => {
    const app = state.apps[key];
    const status = app.enabled ? '● ON ' : '○ OFF';
    const color = app.enabled ? app.color : COLORS.DEBUG;
    menuLine += `${i + 1}. ${color}${key.toUpperCase()} ${status}${COLORS.RESET}   `;
  });
  
  process.stdout.write(menuLine + '\n');
  process.stdout.write(`${COLORS.MENU_TEXT}  Lvl: [+/-] ${LOG_LEVELS[state.minLevel]} | [q] Quit${COLORS.RESET}\n`);
  process.stdout.write(`${COLORS.BORDER}----------------------------------------------------------------${COLORS.RESET}\n`);

  process.stdout.write(`\x1b[${MENU_SIZE + 1};r`);

  process.stdout.write('\x1b[u'); 
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.end(); return; }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { app, level, category, message, data } = JSON.parse(body);
        const appConfig = state.apps[app];
        const lvlIdx = LOG_LEVELS.indexOf(level);

        if (appConfig?.enabled && lvlIdx >= state.minLevel) {
          const time = new Date().toLocaleTimeString();
          const appLabel = `${appConfig.color}[${app.toUpperCase()}]${COLORS.RESET}`;
          const levelLabel = `${COLORS[level]}[${level}]${COLORS.RESET}`;
          
          process.stdout.write(`${COLORS.DEBUG}${time}${COLORS.RESET} ${appLabel} ${levelLabel} <${category}> ${message}\n`);
          if (data) {
            process.stdout.write(JSON.stringify(data, null, 2) + '\n');
          }
        }
      } catch (e) {}
      res.end();
    });
  }
});

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
    process.stdout.write('\x1b[r');
    process.stdout.write('\x1b[2J\x1b[H');
    process.exit();
  }
  
  const num = parseInt(str) - 1;
  const apps = Object.keys(state.apps);
  if (apps[num]) {
    state.apps[apps[num]].enabled = !state.apps[apps[num]].enabled;
    drawMenu();
  }

  if (str === '+' || str === '-') {
    if (str === '+') state.minLevel = Math.min(state.minLevel + 1, LOG_LEVELS.length - 1);
    else state.minLevel = Math.max(state.minLevel - 1, 0);
    drawMenu();
  }
});

server.listen(PORT, () => {
  process.stdout.write('\x1b[2J\x1b[H');
  drawMenu();
  process.stdout.write(`\x1b[${MENU_SIZE + 1};1H`);
});