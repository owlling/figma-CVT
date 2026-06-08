const fs = require('fs');
const path = require('path');

// 读取文件夹中的所有SVG文件
const svgFolder = '/Users/bytedance/Documents/trae_projects/figma-CVT/assets/ishihara';
const svgFiles = fs.readdirSync(svgFolder).filter(f => f.endsWith('.svg'));

// 读取每个SVG文件内容
const svgData = {};
svgFiles.forEach(file => {
  const key = file.replace('plate-', '').replace('.svg', '');
  const content = fs.readFileSync(path.join(svgFolder, file), 'utf8');
  svgData[key] = content;
});

console.log('✅ 读取的SVG文件:', Object.keys(svgData));

// 读取ui.html
let uiHtml = fs.readFileSync('ui.html', 'utf8');

// 找到替换位置
const startMarker = '  // SVG Data URIs - 直接从 assets/ishihara/ 文件夹读取的完整SVG内容';
const endMarker = '  // 别名映射：把无前导零的键映射到有前导零的';

const startIdx = uiHtml.indexOf(startMarker);
const endIdx = uiHtml.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('❌ 未找到标记位置！');
  process.exit(1);
}

// 构建新的SVG数据部分
let svgDataStr = `  // SVG Data URIs - 直接从 assets/ishihara/ 文件夹读取的完整SVG内容
  const IshiharaSVGData = {\n`;

for (const key of ['02', '05', '07', '08', '12', '16', '29', '35', '45', '74', '96', '']) {
  if (svgData[key]) {
    svgDataStr += `    '${key}': ${JSON.stringify(svgData[key])},\n`;
  } else if (key === '') {
    svgDataStr += `    '': \`<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><circle cx="150" cy="150" r="140" fill="#fffef9"/></svg>\`,\n`;
  }
}

svgDataStr += `  };
  
  // 别名映射：把无前导零的键映射到有前导零的
  const IshiharaSVGMap = {
    '2': IshiharaSVGData['02'],
    '5': IshiharaSVGData['05'],
    '7': IshiharaSVGData['07'],
    '8': IshiharaSVGData['08'],
    '12': IshiharaSVGData['12'],
    '16': IshiharaSVGData['16'],
    '29': IshiharaSVGData['29'],
    '35': IshiharaSVGData['35'],
    '45': IshiharaSVGData['45'],
    '74': IshiharaSVGData['74'],
    '96': IshiharaSVGData['96']
  };\n`;

// 替换内容
uiHtml = uiHtml.substring(0, startIdx) + svgDataStr + uiHtml.substring(endIdx);

// 写入新文件
fs.writeFileSync('ui.html', uiHtml, 'utf8');
console.log('✅ ui.html 更新成功！');
console.log('✅ 现在使用的是真实的石原氏色板图片！');
