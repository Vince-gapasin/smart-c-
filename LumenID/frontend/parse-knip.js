const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync('C:\\Users\\Admin\\Documents\\GitHub\\LumenID\\frontend\\knip-results.json', 'utf-16le').replace(/^\uFEFF/, ''));

console.log("=== UNUSED FILES ===");
data.files.forEach(f => console.log(f));

console.log("\n=== UNUSED DEPENDENCIES ===");
data.dependencies.forEach(d => console.log(d.name));

console.log("\n=== UNUSED DEV DEPENDENCIES ===");
data.devDependencies.forEach(d => console.log(d.name));
