figma.showUI(__html__, { width: 600, height: 700 });

async function getImageFromSelection() {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.ui.postMessage({ type: 'no-selection' });
    return;
  }

  const node = selection[0];
  
  try {
    if ('fills' in node && node.fills) {
      const fills = Array.isArray(node.fills) ? node.fills : [node.fills];
      const imageFill = fills.find(fill => fill.type === 'IMAGE');
      
      if (imageFill && imageFill.imageHash) {
        const image = figma.getImageByHash(imageFill.imageHash);
        if (image) {
          const bytes = await image.getBytesAsync();
          figma.ui.postMessage({ 
            type: 'image-data', 
            data: bytes,
            width: node.width,
            height: node.height
          });
          return;
        }
      }
    }
    
    const bytes = await node.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 2 } });
    figma.ui.postMessage({ 
      type: 'image-data', 
      data: bytes,
      width: node.width * 2,
      height: node.height * 2
    });
    
  } catch (error) {
    figma.ui.postMessage({ type: 'error', message: '无法获取选中节点的图像数据' });
  }
}

figma.on('selectionchange', getImageFromSelection);

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'get-image') {
    getImageFromSelection();
  } else if (msg.type === 'generate-report') {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.notify('请先选择一个节点');
      return;
    }
    
    const frame = figma.createFrame();
    frame.name = '色觉缺陷对比报告';
    frame.resize(1200, 800);
    frame.x = figma.viewport.center.x - 600;
    frame.y = figma.viewport.center.y - 400;
    frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    
    figma.notify('报告已生成！');
  }
};
