/* eslint-env node */
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('eslint.json', 'utf8'));
let output = '';
data.forEach(f => {
  if (f.errorCount > 0 || f.warningCount > 0) {
    output += f.filePath + '\n';
    f.messages.forEach(m => {
      output += `  Line ${m.line}: ${m.message} (${m.ruleId})\n`;
    });
  }
});
fs.writeFileSync('eslint_summary.txt', output);
console.log('Done');
