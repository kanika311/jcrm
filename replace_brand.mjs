import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const searchTerms = [
  { from: /Lumina/g, to: 'JavaCoders' },
  { from: /lumina/g, to: 'javacoders' }
];

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('.ts') || dirFile.endsWith('.tsx') || dirFile.endsWith('.css') || dirFile.endsWith('.json') || dirFile.endsWith('.md')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const files = walkSync(__dirname);

let changedFiles = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  for (const { from, to } of searchTerms) {
    if (from.test(content)) {
      content = content.replace(from, to);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log(`Updated ${file}`);
  }
}

console.log(`Finished replacing in ${changedFiles} files.`);
