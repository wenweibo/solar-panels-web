(function () {

  function rectOn() {
    // 禁用所有对象
    canvas.getObjects().forEach(o => o.set('selectable', false));
  }

  let rect, isDown, origX, origY;
  function startRect(x, y, evt) {
    isDown = true;

    origX = x;
    origY = y;

    rect = new fabric.Rect({
      left: origX,
      top: origY,
      fill: "transparent",
      strokeWidth: Tools.Width,
      stroke: Tools.getColor(Tools.Color),
      // 精度
      perPixelTargetFind: true,
    });

    rect.set('selectable', false)
  }

  function continueRect(x, y, evt) {
    if (!isDown) return;

    if (rectTool.secondary.active) {
      // 鼠标拖动的水平和垂直距离
      let dx = x - origX;
      let dy = y - origY;
      // 返回最大值【对角线】
      let d = Math.max(Math.abs(dx), Math.abs(dy));
      // x 和 y 分别表示矩形的右下角点的坐标，根据 dx 和 dy 的正负性，计算出该点的坐标。如果 dx 或 dy 为正，则该点坐标为对角线长度，否则为负的对角线长度。
      x = origX + (dx > 0 ? d : -d);
      y = origY + (dy > 0 ? d : -d);
    }

    rect.set({
      // 矩形左边缘的 x 坐标，取值为原始点的 x 坐标和当前点的 x 坐标中的最小值。
      left: Math.min(origX, x),
      top: Math.min(origY, y),
      width: Math.abs(origX - x),
      height: Math.abs(origY - y),
    });
    canvas.remove(rect);
    canvas.add(rect);
  }

  function stopRect() {
    // 自动切换到select工具
    // Tools.change("Selector");
    isDown = false;
  }

  // 记载切换到其他工具时返回值等的处理
  function quit() {
  }

  var rectTool = {
    "name": "Rect",
    "listeners": {
      "press": startRect,
      "move": continueRect,
      "release": stopRect,
    },
    // 2D图像详情
    "secondary": {
      "name": "Square",
      "icon": "tools/rectangle/icon.svg",
      "active": false,
    },
    "defaultCursor": "crosshair",
    "icon": "tools/rectangle/icon.svg",
    "oneTouch": true,
    // 点击侧边栏
    "onstart": rectOn,
    "quit": quit,
  };
  Tools.add(rectTool);
})();