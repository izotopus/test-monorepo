const fs = require('fs');
const path = require('path');

const modules = [
  { name: 'task-manager', from: 'apps/test-task-manager/dist/main.js' },
  // { name: 'analytics', from: 'apps/test-analytics/dist/main.js' }
];

const portalDist = path.join(__dirname, '../apps/test-portal/dist/modules');

async function collect() {
  try {
    for (const mod of modules) {
      const source = path.join(__dirname, '..', mod.from);
      const destFolder = path.join(portalDist, mod.name);
      const destFile = path.join(destFolder, 'main.js');

      fs.mkdirSync(destFolder, { recursive: true });
      
      fs.copyFileSync(source, destFile);
      console.log(`✅ Module ${mod.name} collected to ${destFile}`);
    }
  } catch (err) {
    console.error('❌ Error collecting modules:', err.message);
    process.exit(1);
  }
}

collect();