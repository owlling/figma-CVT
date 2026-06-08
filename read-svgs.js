// 读取所有SVG文件并生成代码
const fs = require('fs');
const path = require('path');

const svgDir = path.join(__dirname, 'assets', 'ishihara');
const files = fs.readdirSync(svgDir).filter(f => f.endsWith('.svg'));

const svgData = {};

files.forEach(file => {
  const content = fs.readFileSync(path.join(svgDir, file), 'utf8');
  const key = file.replace('plate-', '').replace('.svg', '');
  svgData[key] = content;
});

console.log('// 生成的SVG数据:');
console.log('const IshiharaSVGData = {');
for (const [key, value] of Object.entries(svgData)) {
  const escaped = value.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  console.log(`  '${key}': \`${escaped}\`,`);
}
console.log('};');

fs.writeFileSync(path.join(__dirname, 'svg-data.js'), `
// 自动生成的SVG数据
const IshiharaSVGData = {
${Object.entries(svgData).map(([key, value]) => {
  const escaped = value.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  return `  '${key}': \`${escaped}\``;
}).join(',\n')}
};
`);

console.log('\n✅ SVG数据已生成到 svg-data.js');
