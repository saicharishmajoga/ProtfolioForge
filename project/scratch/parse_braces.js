const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '../../backend/src'));
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  let braceLevel = 0;
  
  lines.forEach((line, idx) => {
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    
    if (braceLevel === 0) {
      const trimmed = line.trim();
      if (trimmed.startsWith('let ') || trimmed.startsWith('var ') || trimmed.startsWith('const ')) {
        if (!trimmed.includes('import ')) {
          console.log(`${path.basename(file)}:${idx + 1}: ${trimmed}`);
        }
      }
    }
    
    braceLevel += openBraces - closeBraces;
  });
});
