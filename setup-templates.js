// Quick script to create template directories
const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'templates');
const subdirs = ['nextjs', 'express', 'python', 'rust'];

// Create base directory
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
  console.log('✓ Created templates directory');
}

// Create subdirectories
subdirs.forEach(dir => {
  const fullPath = path.join(baseDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✓ Created templates/${dir} directory`);
  }
});

console.log('\n✅ Template structure ready!');
