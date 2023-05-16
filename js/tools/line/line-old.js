
(function () {

  var line, isDown;

  // 监听按下鼠标时
  function startLine(x, y, evt) {
    // 是否开始画
    isDown = true;
    // 开始的点、结束的点
    var points = [x, y, x, y];
    // 创建fabric线条对象
    line = new fabric.Line(points, {
      // 笔触宽度
      strokeWidth: Tools.Width,
      // 笔触填充颜色
      fill: Tools.getColor(Tools.Color),
      // 笔触边框颜色
      stroke: Tools.getColor(Tools.Color),
      // 指定画布图像的水平和垂直变换
      originX: 'center',
      originY: 'center',
      // 是否被选中
      selectable: false,
      // 对象缓存：对象不会在画布上重新绘制，而只是将其复制的缓存图像绘制在画布上
      objectCaching: false,
    });
    canvas.add(line);
    
  }

  // 监听移动鼠标
  function continueLine(x, y, evt) {
    // 没画就退出这个方法
    if (!isDown) return;
    // 在画就执行↓【在画一直更新位置】
    line.set({ x2: x, y2: y });

    // 渲染方法（所有对canvas的修改，包括在其中添加删除对象，以及对象参数的修改，都需要调用渲染方法才能显示出来）
    canvas.renderAll();
  }

  // 监听抬起鼠标
  function stopLine(x, y, evt) {
    // 自动切换到select工具
    Tools.change("Selector");
    // 结束
    isDown = false;
  }

  // 记载切换到其他工具时返回值等的处理
  function quit() {
  }

  var lineTool = {
    "name": "Straight line",
    "listeners": {
      "press": startLine,
      "move": continueLine,
      "release": stopLine,
    },
    "defaultCursor": "crosshair",
    "hoverCursor": "crosshair",
    "icon": "tools/line/icon.svg",
    "quit": quit
  };
  Tools.add(lineTool);
})();