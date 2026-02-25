const path = require('path');
const fs = require('fs');
const utils = require('./lib/utils');

function collect() {
  const isProd = process.argv.includes('--prod');
  const config = utils.loadConfig();
  
  // Decydujemy o katalogu docelowym: public (dev) lub dist (prod)
  const portalSubDir = isProd ? 'dist' : 'public';
  const destBase = path.resolve(utils.rootDir, `apps/test-portal/${portalSubDir}/modules`);

  console.log(`\n📂 Collecting modules into: ${portalSubDir}/modules...`);

  for (const [key, details] of Object.entries(config.apps)) {
    // W trybie DEV kopiujemy tylko te, które NIE są uruchomione na żywo (type: build)
    // W trybie PROD kopiujemy wszystko
    if (!isProd && details.type !== 'build') continue;

    let sourceDir = path.resolve(utils.rootDir, details.distDir);
    const folderName = key.toLowerCase().replace('_', '-');
    const destDir = path.resolve(destBase, folderName);

    if (details.mfType === 'angular') {
      sourceDir = utils.getAngularSource(sourceDir);
    }

    if (fs.existsSync(sourceDir)) {
      if (fs.existsSync(destDir)) fs.rmSync(destDir, { recursive: true, force: true });
      utils.copyDirRecursive(sourceDir, destDir);
      utils.fixAngularHashes(destDir);
      console.log(`  ✅ ${key} -> ${folderName}`);
    } else {
      console.warn(`  ⚠️  Source not found for ${key}: ${sourceDir}`);
    }
  }
}

collect();