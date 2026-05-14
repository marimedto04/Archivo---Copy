const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'chatbot', 'content');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    // Change back to .ts
    content = content.replace(/from '\.\.\/subjects\.content\.js'/g, "from '../subjects.content.ts'");
    // Already did import type, leave it as is
    fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Done replacing imports in content files.');
