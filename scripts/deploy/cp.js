const fs = require('fs').promises;
const path = require('path');


const projectPath = path.resolve(__dirname, '../..');
const source = path.join(projectPath, '/functions');
const target = path.join(projectPath, '/.vercel/output/functions');


(async () => {
  try {
    await fs.cp(source, target, { recursive: true });
    console.log('Copied functions!');
  } catch (error) {
    console.log('Error: ', error);
  }
})();
