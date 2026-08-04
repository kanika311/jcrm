const fs = require('fs');
const path = require('path');

const excludeFiles = [
  'page.tsx', 
  'LandingPageClient.tsx', 
  'auth/page.tsx' // Wait, simple names might conflict, better to use full paths or just check includes
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if(file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const targets = [
  path.join(__dirname, 'app'),
  path.join(__dirname, 'components')
];

let allFiles = [];
targets.forEach(t => allFiles = allFiles.concat(walk(t)));

// Filter exceptions
allFiles = allFiles.filter(f => !f.includes('auth\\page.tsx') && !f.includes('LandingPageClient.tsx') && !(f.includes('app\\page.tsx') && f.endsWith('app\\page.tsx')));

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Text
  content = content.replace(/\btext-white\b/g, 'text-txt-primary');
  content = content.replace(/\btext-(slate|gray)-(300|400)\b/g, 'text-txt-secondary');
  content = content.replace(/\btext-(slate|gray)-500\b/g, 'text-txt-tertiary');

  // Backgrounds
  content = content.replace(/\bbg-\[\#0B0F19\]\b/g, 'bg-surf-base');
  content = content.replace(/\bbg-\[\#131B2F\]\b/g, 'bg-surf-card');
  content = content.replace(/\bbg-slate-900\b/g, 'bg-surf-base');
  content = content.replace(/\bbg-white\/5\b/g, 'bg-surf-elevated');
  content = content.replace(/\bbg-white\/10\b/g, 'bg-surf-hover');

  // Borders
  content = content.replace(/\bborder-white\/5\b/g, 'border-bdr-soft');
  content = content.replace(/\bborder-white\/10\b/g, 'border-bdr-soft');
  content = content.replace(/\bborder-white\/20\b/g, 'border-bdr-med');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Refactored:', file);
  }
});
