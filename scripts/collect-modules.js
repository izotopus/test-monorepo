const fs = require('fs');
const path = require('path');

const modules = [
  { name: 'task-manager', distDir: 'apps/test-task-manager/dist' },
  // { name: 'analytics', distDir: 'apps/test-analytics/dist' }
];

const portalDist = path.join(__dirname, '../apps/test-portal/dist/modules');

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function collect() {
  try {
    for (const mod of modules) {
      const sourceDir = path.join(__dirname, '..', mod.distDir);
      const destDir = path.join(portalDist, mod.name);

      if (fs.existsSync(sourceDir)) {
        copyDirRecursive(sourceDir, destDir);
        console.log(`✅ Module ${mod.name}: All files collected to ${destDir}`);
      } else {
        console.warn(`⚠️ Warning: Source directory ${sourceDir} not found. Skipping.`);
      }
    }
  } catch (err) {
    console.error('❌ Error collecting modules:', err.message);
    process.exit(1);
  }
}

collect();