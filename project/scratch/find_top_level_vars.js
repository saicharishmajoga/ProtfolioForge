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
    // Check if line starts at index 0 (top level of the file) and has let or var
    if (line.match(/^(let|var)\s+\w+/) || (line.match(/^const\s+\w+\s*=\s*(new|{|\[)/) && !line.includes('prisma') && !line.includes('Router') && !line.includes('z.object') && !line.includes('express()') && !line.includes('envSchema') && !line.includes('swaggerSpec'))) {
      console.log(`${path.basename(file)}:${idx + 1}: ${line.trim()}`);
    }
  });
});
