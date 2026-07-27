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
  lines.forEach((line, idx) => {
    // Look for properties declared inside class but not methods
    if (line.match(/^\s*(private|public|protected)?\s+\w+\s*:\s*[^=\(]+;/) || line.match(/^\s*(private|public|protected)?\s+\w+\s*=\s*[^=\(]+;/)) {
      console.log(`${path.basename(file)}:${idx + 1}: ${line.trim()}`);
    }
  });
});
