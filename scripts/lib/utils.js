const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const rootDir = path.resolve(__dirname, '../../');

const utils = {
  rootDir,
  configPath: path.resolve(rootDir, 'dev-config.yaml'),
  
  loadConfig() {
    if (!fs.existsSync(this.configPath)) {
      console.error(`❌ Config not found at ${this.configPath}`);
      process.exit(1);
    }
    return yaml.load(fs.readFileSync(this.configPath, 'utf8'));
  },

  copyDirRecursive(src, dest) {
    if (dest.startsWith(src)) return;
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src, { withFileTypes: true }).forEach(entry => {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      entry.isDirectory() 
        ? this.copyDirRecursive(srcPath, destPath) 
        : fs.copyFileSync(srcPath, destPath);
    });
  },

  ensureStubsExist(outputDir, configFiles) {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    Object.values(configFiles).forEach(file => {
      const filePath = path.join(outputDir, file);
      if (!fs.existsSync(filePath)) {
        const fallback = `export const MF_CONFIG = {} as any;\nexport type MFKey = string;`;
        fs.writeFileSync(filePath, fallback);
        console.log(`  💡 Created stub: ${file}`);
      }
    });
  },

  getAngularSource(distDir) {
    const angularPath = path.join(distDir, 'test-analytics/browser');
    return fs.existsSync(angularPath) ? angularPath : distDir;
  },

  fixAngularHashes(destDir) {
    if (!fs.existsSync(destDir)) return;
    const files = fs.readdirSync(destDir);
    files.forEach(f => {
      if (f.startsWith('main-') && f.endsWith('.js')) 
        fs.renameSync(path.join(destDir, f), path.join(destDir, 'main.js'));
      if (f.startsWith('polyfills-') && f.endsWith('.js')) 
        fs.renameSync(path.join(destDir, f), path.join(destDir, 'polyfills.js'));
    });
  }
};

module.exports = utils;