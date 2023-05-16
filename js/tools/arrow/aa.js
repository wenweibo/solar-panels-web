// 箭头功能
(function () {
  // 判断是否在画
  var isDown, ctx, line, points;
  // 渲染上下文
  ctx = canvas.getContext("2d");

  /* 
   * ====== 声明了一个arrow对象 ======
   */

  // 库里声明了【utils是这个fabricjs下挂的对象，里面有很多方法】
  fabric.Arrow = fabric.util.createClass(fabric.Line, {
    // 类型：终点箭头
    type: 'Arrow',
    // 【===初始化的方法===】
    // element：数组-起点位置, options：对象-终点位置
    initialize: function (element, options) {
      // console.log(element,options);  // 【有东西、起点终点位置】

      // console.log(element,123)

      // 判断option是否有东西，没有给空对象
      options || (options = {});
      this.callSuper('initialize', element, options);
      this._render(ctx);
    },

    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'));
    },
    _render: function (ctx) {
      // console.log(ctx, this.x2)
      this.callSuper('_render', ctx);   //没有这句话就是个三角

      // 如果宽度/高度为零或对象不可见，则不渲染
      if (this.width === 0 && this.height === 0 || !this.visible) return;

      ctx.save();
      // 得到x轴长度
      var xDiff = this.x2 - this.x1;
      // 得到y轴长度
      var yDiff = this.y2 - this.y1;
      // 得到角度

      // console.log(this.x1,this.y1,this.x2,this.y2)
      var angle = Math.atan2(yDiff, xDiff);

      // ctx.save();
      // 得到x轴长度
      var xDiff = this.x2 - this.x1;
      // 得到y轴长度
      var yDiff = this.y2 - this.y1;
      // 得到角度

      // console.log(this.x1,this.y1,this.x2,this.y2)
      var angle = Math.atan2(yDiff, xDiff);


      // 调整三角位置
      ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
      ctx.rotate(angle);
      ctx.beginPath();
      // 将10px移动到线的前面以开始箭头，这样它就不会在前面显示方形线的末端（0,0）
      ctx.moveTo(10, 0);
      ctx.lineTo(-10, 10);
      ctx.lineTo(-10, -10);
      ctx.closePath();
      ctx.fillStyle = this.stroke;
      ctx.fill();
      ctx.restore();
      // console.log(112122);  // 进了
    },
    clipTo: function (ctx) {
      this._render(ctx);
      // console.log(111);  // 【没进】
    }
  }
  );

  // 【箭头开始的对象】object：起点终点的位置；callback：一个函数里面包含起点终点坐标的方法；
  // 【===函数定义===】
  fabric.Arrow.fromObject = function (object, callback) {
    // 逻辑中断【遇假中断，走了第二个】
    // console.log(object,callback);
    callback && callback(new fabric.Arrow([object.x1, object.y1, object.x2, object.y2], object));
  };
  fabric.Arrow.async = true;

  /* 
  * ====== 声明第二个带箭头的对象 ======
  */

  // 库里声明了【utils是这个fabricjs下挂的对象，里面有很多方法】
  fabric.startArrow = fabric.util.createClass(fabric.Line, {
    // 类型：终点箭头
    type: 'Arrow',
    // 【===初始化的方法===】
    // element：数组-起点位置, options：对象-终点位置
    initialize: function (element, options) {
      // console.log(element,options);  // 【有东西、起点终点位置】
      // 判断option是否有东西，没有给空对象
      options || (options = {});
      this.callSuper('initialize', element, options);
      this._render(ctx);
    },

    toObject: function () {
      return fabric.util.object.extend(this.callSuper('toObject'));
    },
    _render: function (ctx) {
      // console.log(ctx, this.x2)
      this.callSuper('_render', ctx);   //没有这句话就是个三角

      // 如果宽度/高度为零或对象不可见，则不渲染
      if (this.width === 0 && this.height === 0 || !this.visible) return;

      ctx.save();
      // 得到x轴长度
      var xDiff = this.x2 - this.x1;
      // 得到y轴长度
      var yDiff = this.y2 - this.y1;
      // 得到角度

      // console.log(this.x1,this.y1,this.x2,this.y2)
      var angle = Math.atan2(yDiff, xDiff);
      // console.log(angle)

      // 调整三角位置
      ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
      ctx.rotate(angle);
      ctx.beginPath();
      // 将10px移动到线的前面以开始箭头，这样它就不会在前面显示方形线的末端（0,0）
      ctx.moveTo(10, 0);
      ctx.lineTo(-10, 10);
      ctx.lineTo(-10, -10);
      ctx.closePath();
      ctx.fillStyle = this.stroke;
      ctx.fill();
      ctx.restore();
      // console.log(112122);  // 进了
    },
    clipTo: function (ctx) {
      this._render(ctx);
      // console.log(111);  // 【没进】
    }
  }
  );
  // 【箭头开始的对象】object：起点终点的位置；callback：一个函数里面包含起点终点坐标的方法；
  // 【===函数定义===】
  fabric.startArrow.fromObject = function (object, callback) {
    // 逻辑中断【遇假中断，走了第二个】
    // console.log(object,callback);
    callback && callback(new fabric.startArrow([object.x1, object.y1, object.x2, object.y2], object));
  };
  fabric.startArrow.async = true;

  /* 
  * ====== 监听鼠标 ======
  */

  var triangle, allTogetherObj;

  // 监听按下鼠标时
  function startLine(x, y, evt) {
    // 是否开始画
    isDown = true;
    // 初始化起点坐标和终点坐标
    // points = [x, y, x, y];
    let obj = {
      x1: x,
      y1: y,
      x2: x,
      y2: y,
    }

    points = [obj.x1, obj.y1, obj.x2, obj.y2]

    /* 
    * 【自己声明箭头对象，然后去改变样式，控制动画】
    */

    // 箭头1
    line = new fabric.Arrow(points, {
      strokeWidth: 3,
      fill: 'black',
      stroke: 'black',
      originX: 'center',
      originY: 'center',
      hasBorders: false,
      hasControls: false,
      // 是否被选中
      selectable: false,
      // 对象缓存：对象不会在画布上重新绘制，而只是将其复制的缓存图像绘制在画布上
      objectCaching: false,
    });
    canvas.add(line);

    // 箭头2
    triangle = new fabric.startArrow(points, {
      strokeWidth: 3,
      fill: 'black',
      stroke: 'black',
      originX: 'center',
      originY: 'center',
      hasBorders: false,
      hasControls: false,
      // 是否被选中
      selectable: false,
      // 对象缓存：对象不会在画布上重新绘制，而只是将其复制的缓存图像绘制在画布上
      objectCaching: false,
    });
    canvas.add(triangle);

    /* 
    * ====== 把俩箭头合成一个group ======
    */

    // // 得到x轴长度
    // var xDiff = obj.x2 - obj.x1;
    // // 得到y轴长度
    // var yDiff = obj.y2 - obj.y1;
    // // 得到角度
    // var myAngle = Math.atan2(yDiff, xDiff);
    // console.log(xDiff, yDiff, myAngle,obj.x2-obj.x1,);

    // var tu = [triangle, line];
    // allTogetherObj = new fabric.Group(tu, {
    //   left: obj.x1,
    //   top: obj.y1,
    //   // angle: myAngle,
    //   strokeWidth: 3,
    //   fill: 'black',
    //   stroke: 'black',
    //   originX: 'center',
    //   originY: 'center',
    //   hasBorders: false,
    //   hasControls: false,
    //   // 是否被选中
    //   selectable: false,
    //   // 对象缓存：对象不会在画布上重新绘制，而只是将其复制的缓存图像绘制在画布上
    //   objectCaching: false,
    // });
    // console.log(obj.x1);
    // canvas.add(allTogetherObj);
    // console.log(allTogetherObj);   // 有东西

  }

  // 监听移动鼠标【传进来终点坐标】
  function continueLine(x, y, evt) {
    // 没画就退出这个方法
    if (!isDown) return;

    // 删除线和三角，这样在拖拽的时候不会卡。
    canvas.remove(line)
    canvas.remove(triangle)
    canvas.remove(allTogetherObj);
    // 在画就执行↓【在画一直更新位置】【新位置替换旧位置】【自调用函数】
    line.set({ x2: x, y2: y });
    triangle.set({ x1: x, y1: y })
    // allTogetherObj.set({ x1: x, y1: y });
    // console.log(x,y);

    canvas.add(line);
    canvas.add(triangle);
    // canvas.add(allTogetherObj);


    // 渲染方法（所有对canvas的修改，包括在其中添加删除对象，以及对象参数的修改，都需要调用渲染方法才能显示出来）
    // canvas.renderAll();
  }

  // 监听抬起鼠标
  function stopLine(x, y, evt) {
    // 结束
    isDown = false;
  }


  // 记载切换到其他工具等的处理【例如关闭自由绘画可以写里面】
  function quit() {
  }
  // 添加工具
  var arrowTool = {
    "name": "arrow",
    "listeners": {
      "press": startLine,
      "move": continueLine,
      "release": stopLine,
    },
    "defaultCursor": "crosshair",
    "hoverCursor": "crosshair",
    "icon": "tools/arrow/icon.svg",
    "quit": quit
  };
  Tools.add(arrowTool);
})();





