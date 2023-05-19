(function () {
  function rectOn() {
    // 禁用所有对象
    canvas.getObjects().forEach(o => o.set('selectable', false));
    // 点击矩形按钮加背景色
    // alert(11)
    //  console.log(Tools.list);
     const rectbox = document.getElementById('label_Rect');
     const rect = document.getElementById('Rect');
 
     const sele = document.getElementById('label_Selector');
     const out = document.getElementById('label_out');
     function handleClick() {
       if(rect.disabled === false){
         rectbox.style.backgroundColor = "#fff";
       }
     }
     sele.addEventListener('click', handleClick);
     out.addEventListener('click', handleClick);
 
     rectbox.addEventListener('click', function() {
         if(rect.disabled === false){
         rectbox.style.backgroundColor = "#41C6FF";
       }
       });
 
  }
  /* 
  * 【矩形】
  */
  var rect, isDown, origX, origY, MyRect, ctx, rectWithText;
  ctx = canvas.getContext("2d");
  // 创建util.Class对象
  fabric.MyRect = fabric.util.createClass(fabric.Rect, {
    type: 'rectWithText',
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
      /* 
      // 当前this的信息：
      // console.log(this);
      // this.left  this.top == 左上角
      // this.width   this.height
      // console.log(this.left, this.top, this.width, this.height); 
      */
      // 终点位置
      let endx = Math.abs(this.left + this.width);
      let endy = Math.abs(this.top + this.height);
      // console.log(endx,endy);

      // 调用画矩形方法
      this.drawRect(this.left, this.top, this.width, this.height);

      // 加个文字和矩形背景
      if (Math.abs(endx) + Math.abs(this.left) > 40 || Math.abs(endy) + Math.abs(this.top) > 40) {
        this.ctx.font = "14px sans-serif";
        this.ctx.textAlign = "center";
        // 横
        this.ctx.fillStyle = "transparent";
        this.ctx.fillRect(-20, -(this.height / 2) + 3, 40, 20);
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(this.longWidth, 0, -(this.height / 2) + 15);
        // 竖
        // this.ctx.rotate(Math.atan2(endy - this.top, endx - this.left));
        // this.ctx.rotate(Math.PI / 2);
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "transparent";
        this.ctx.fillRect(-(this.width / 2), -13, 40, 25);
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(this.longHeight, -(this.width / 2) + 20, 5);
        // console.log('文本：', this.width, this.height);

      }
    },
    // 画矩形方法
    drawRect: function (xPos, yPos, wid, hei) {
      // 用来保存最近一次的Canvas的状态和属性【---进栈---】
      this.ctx.save();
      // 【矩形】
      // this.ctx.translate(xPos, yPos);
      // 填充样式
      this.ctx.fillStyle = "transparent";
      this.ctx.fill();
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = Tools.Width;
      this.ctx.fillRect(xPos, yPos, wid, hei); // 绘制矩形【左上坐标，宽高】
      // this.ctx.strokeRect(10, 10, 100, 50); // 绘制边框
      // 用来获取save保存的Canvas之前的状态和属性【---出栈---】
      this.ctx.restore();
    }
  });

  // 【===函数定义===】
  fabric.MyRect.fromObject = function (object, callback) {
    callback && callback(new fabric.MyRect([object.x1, object.y1, object.x2, object.y2], object));
  };
  fabric.MyRect.async = true;


  function startRect(x, y, evt) {
    isDown = true;
    // 起点坐标
    origX = x;
    origY = y;
    rectWithText = new fabric.MyRect({
      left: origX,
      top: origY,
      fill: "transparent",
      strokeWidth: Tools.Width,
      stroke: Tools.getColor(Tools.Color),
      selectable: false,
      objectCaching: false,
      // 精度
      perPixelTargetFind: true,
      longWidth: ' (m)',
      longHeight: ' (m)'
    });
    // rectWithText.set('selectable', false)
    canvas.add(rectWithText).setActiveObject(rectWithText);
  }

  function continueRect(x, y, evt) {
    if (!isDown) return;
    let rectObj = canvas.getActiveObject();


    if (rectTool.secondary.active) {
      // 鼠标拖动的水平和垂直距离
      let dx = x - origX;
      let dy = y - origY;
      console.log(dx, dy);
      // 返回最大值【对角线】
      let d = Math.max(Math.abs(dx), Math.abs(dy));
      // x 和 y 分别表示矩形的右下角点的坐标，根据 dx 和 dy 的正负性，计算出该点的坐标。如果 dx 或 dy 为正，则该点坐标为对角线长度，否则为负的对角线长度。
      x = origX + (dx > 0 ? d : -d);
      y = origY + (dy > 0 ? d : -d);
    }

    rectObj.set({
      // 矩形左边缘的 x 坐标，取值为原始点的 x 坐标和当前点的 x 坐标中的最小值。
      left: Math.min(origX, x),
      top: Math.min(origY, y),
      width: Math.abs(origX - x),
      height: Math.abs(origY - y),
      longWidth: `${Math.ceil(Math.abs(origX - x) / 50)}(m)`,
      longHeight: `${Math.ceil(Math.abs(origY - y) / 50)}(m)`,
    });
    canvas.getActiveObject().setCoords();

    canvas.renderAll();
  }

  function stopRect(x, y, evt) {
    let rectObj = canvas.getActiveObject();
    // 得到宽高【lineObj.height   lineObj.width】
    // 计算增加的值
    widthPlus = 50 - (rectObj.width % 50);
    heightPlus = 50 - (rectObj.height % 50);
    // 不够长则自动加50（1m）
    let newWidth = rectObj.width + widthPlus;
    let newHeight = rectObj.height + heightPlus;

    // console.log('宽度和高度分别是：' + newWidth, newHeight);

    rectObj.set({
      width: newWidth,
      height: newHeight,
      longWidth: `${Math.ceil(newWidth / 50)}(m)`,
      longHeight: `${Math.ceil(newHeight / 50)}(m)`,
    });
    window.rectWidth = Math.ceil(newWidth / 50);
    window.rectHeight = Math.ceil(newHeight / 50);
    // 输出
    // alert(`宽度是：${Math.ceil(newWidth / 50)}(m)、高度是：${Math.ceil(newHeight / 50)}(m)`);

    // 禁用按钮
    // console.log(Tools);
    const rectbox = document.getElementById('label_Rect');
    const rect = document.getElementById('Rect');
    rect.disabled = 'disabled';
    rectbox.style.backgroundColor = "#BFBFBF";

    // 解除禁用out按钮
    const outbtn = document.getElementById('out');
    const outLabel = document.getElementById('label_out');
    outbtn.disabled = false;
    outLabel.style.backgroundColor = "#fff";

    // 结束
    rectObj.set({
      // 它指定是否在下一次渲染调用时重新渲染对象缓存。
      dirty: true,
      // 对象缓存
      objectCaching: true
    });

    // 自动切换到select工具
    Tools.change("Selector");
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