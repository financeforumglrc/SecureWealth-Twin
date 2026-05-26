const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const www = path.join(root, 'www');

async function rmDir(dir) {
  try {
    await fs.promises.rm(dir, { recursive: true, force: true });
  } catch {}
}

async function cpDir(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await cpDir(s, d);
    } else {
      await fs.promises.copyFile(s, d);
    }
  }
}

async function copyToWww() {
  console.log('\n📦 Building www/ for Capacitor...\n');
  await rmDir(www);
  await fs.promises.mkdir(www, { recursive: true });

  const items = [
    'index.html',
    'manifest.json',
    'favicon.ico',
    'sw.js',
    'CNAME',
    'js',
    'css',
    'assets',
    'api'
  ];

  for (const item of items) {
    const src = path.join(root, item);
    const dest = path.join(www, item);
    try {
      await fs.promises.access(src);
      const stat = await fs.promises.stat(src);
      if (stat.isDirectory()) {
        await cpDir(src, dest);
      } else {
        await fs.promises.copyFile(src, dest);
      }
      console.log(`  ✓ ${item}`);
    } catch {
      console.log(`  - ${item} (skipped)`);
    }
  }

  console.log('\n✅ www/ ready for Capacitor!');
  console.log('   Run: npx cap sync android\n');
}

copyToWww().catch(err => {
  console.error('Copy failed:', err);
  process.exit(1);
});
