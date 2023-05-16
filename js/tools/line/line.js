
(function () {

  var line, isDown, lineWithText, ctx;
  // 渲染上下文
  ctx = canvas.getContext("2d");

  // 通过fabric创建util.Class对象
  fabric.MyLine = fabric.util.createClass(fabric.Line, {
    type: 'lineWithText',
    // 初始化
    initialize: function (element, options) {
      options || (options = {});
      this.callSuper('initialize', element, options);
    },
    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject')
      );
    },
    _render: function (ctx) {
      this.ctx = ctx;
      this.callSuper('_render', ctx);
      // 如果宽度/高度为零或对象不可见，则不渲染
      if (this.width === 0 && this.height === 0 || !this.visible) return;
      // 计算线点
      let p = this.calcLinePoints();
      // x轴长度
      let xDiff = this.x2 - this.x1;
      // y轴长度
      let yDiff = this.y2 - this.y1;
      // 角度
      let angle = Math.atan2(yDiff, xDiff);
      // 调用画线方法
      this.drawline(angle, p.x1, p.y1);

      // 加个文字和矩形背景
      if (Math.abs(p.x2) + Math.abs(p.x1) > 40 || Math.abs(p.y2) + Math.abs(p.y1) > 40) {
        this.ctx.font = "14px sans-serif";
        // this.ctx.rotate(Math.atan2(this.y2 - this.y1, this.x2 - this.x1));
        this.ctx.fillStyle = "white";
        // this.ctx.fillRect(-30, -15, 62, 30);
        this.ctx.fillRect(-20, -15, 40, 30);
        this.ctx.textAlign = "center";

        this.ctx.fillStyle = this.stroke;
        this.ctx.fillText(this.long, 0, 5);
      }
      // ctx.font = '18px Arial';
      // ctx.fillStyle = '#000';
      // ctx.fillText(this.text, this.x1 + (this.x2 - this.x1) / 2, this.y1 + (this.y2 - this.y1) / 2);
    },
    // 画线方法
    drawline: function (angle, xPos, yPos) {
      // 用来保存最近一次的Canvas的状态和属性【---进栈---】
      this.ctx.save();
      // 【线】
      this.ctx.translate(xPos, yPos);
      this.ctx.rotate(angle);
      // 填充样式
      this.ctx.fillStyle = this.stroke;
      this.ctx.fill();
      // 用来获取save保存的Canvas之前的状态和属性【---出栈---】
      this.ctx.restore();
    }
  });

  // 【线开始的对象】object：起点终点的位置；callback：一个函数里面包含起点终点坐标的方法；
  // 【===函数定义===】
  // console.log(fabric.MyLine);
  fabric.MyLine.fromObject = function (object, callback) {
    callback && callback(new fabric.MyLine([object.x1, object.y1, object.x2, object.y2], object));
  };
  fabric.MyLine.async = true;

  // 监听按下鼠标时
  function startLine(x, y, evt) {
    // 是否开始画
    isDown = true;
    // 开始的点、结束的点
    var points = [x, y, x, y];
    // 创建fabric线条对象
    lineWithText = new fabric.MyLine(points, {
      strokeWidth: Tools.Width,
      fill: 'black',
      stroke: 'black',
      originX: 'center',
      originY: 'center',
      selectable: false,
      // 对象缓存：对象不会在画布上重新绘制，而只是将其复制的缓存图像绘制在画布上
      objectCaching: false,
      // 精细选中
      perPixelTargetFind: true,
      long: ' (m)'
    });
    canvas.add(lineWithText).setActiveObject(lineWithText);

  }

  // 监听移动鼠标
  function continueLine(x, y, evt) {
    // 没画就退出这个方法
    if (!isDown) return;

    let lineObj = canvas.getActiveObject();
    let length = Math.hypot(lineObj.height, lineObj.width);
    // console.log(length);
    canvas.getActiveObject().set({ x2: x, y2: y, long: `${Math.ceil(length / 50)}(m)` });
    canvas.getActiveObject().setCoords();

    canvas.renderAll();
  }

  // 监听抬起鼠标
  function stopLine(x, y, evt) {
    let lineObj = canvas.getActiveObject();
    let length = Math.hypot(lineObj.height, lineObj.width);   // 线的长度
    arrowPlus = 50 - (length % 50);
    // console.log(arrowPlus);
    let newLength = length + arrowPlus;   // 不够长则自动加50（1m）
    let stopLineX2 = lineObj.x1 + (newLength * (lineObj.x2 - lineObj.x1)) / length;
    let stopLineY2 = lineObj.y1 + (newLength * (lineObj.y2 - lineObj.y1)) / length;

    lineObj.set({ x2: stopLineX2, y2: stopLineY2, long: `${Math.ceil(length / 50)}(m)` });
    // 结束
    lineObj.set({
      // 它指定是否在下一次渲染调用时重新渲染对象缓存。
      dirty: true,
      // 对象缓存
      objectCaching: true
    });

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