
const fs = require('fs');

// 读取 ui.html
let uiHtml = fs.readFileSync('ui.html', 'utf8');

// 读取 svg-data.js
let svgData = fs.readFileSync('svg-data.js', 'utf8');

// 提取 IshiharaSVGData 内容
let svgDataContent = svgData.split('const IshiharaSVGData = ')[1];
svgDataContent = svgDataContent.trim();
if (svgDataContent.endsWith(';')) {
  svgDataContent = svgDataContent.slice(0, -1);
}

// 找到 ui.html 中 IshiharaSVGData 的位置并替换
let startTag = "  // SVG Data URIs - 直接从 assets/ishihara/ 文件夹读取的完整SVG内容\n  const IshiharaSVGData = {";
let endTag = "  // 别名映射：把无前导零的键映射到有前导零的";

let startIndex = uiHtml.indexOf(startTag);
let endIndex = uiHtml.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
  // 替换这部分内容
  let oldContent = uiHtml.substring(startIndex + startTag.length - 1, endIndex);
  let newContent = "\n  " + svgDataContent + "\n  ";
  uiHtml = uiHtml.substring(0, startIndex) + startTag + newContent + uiHtml.substring(endIndex);
  
  fs.writeFileSync('ui.html', uiHtml, 'utf8');
  console.log('✅ ui.html 已更新！');
} else {
  console.error('❌ 未找到目标内容！');
}
