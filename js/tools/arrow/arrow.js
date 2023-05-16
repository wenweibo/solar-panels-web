// 箭头功能
(function () {
    // 判断是否在画
    var isDown, ctx, LineArrow, points, text;
    var x01, x02, y01, y02;

    // 渲染上下文
    ctx = canvas.getContext("2d");
    /* 
     * 声明了一个arrow对象
     */
    // 库里声明了【utils是这个fabricjs下挂的对象，里面有很多方法】
    fabric.LineArrow = fabric.util.createClass(fabric.Line, {
        // 类型
        type: 'lineArrow',
        // 初始化
        initialize: function (element, options) {
            // 判断options是否有东西【有】
            options || (options = {});
            this.callSuper('initialize', element, options);
            // ======================================================================
            // this._render(ctx);
        },

        toObject: function () {
            return fabric.util.object.extend(this.callSuper('toObject'));
        },

        // render：提供、提交、表达、呈现
        _render: function (ctx) {
            this.ctx = ctx;
            this.callSuper('_render', ctx);    //没有这句话就是个三角

            // 如果宽度/高度为零或对象不可见，则不渲染
            if (this.width === 0 && this.height === 0 || !this.visible) return;

            // 计算线点
            let p = this.calcLinePoints();
            // console.log(p);
            // x轴长度
            let xDiff = this.x2 - this.x1;
            // y轴长度
            let yDiff = this.y2 - this.y1;
            // 角度
            let angle = Math.atan2(yDiff, xDiff);
            // 调用画箭头的方法
            this.drawArrow(angle, p.x2, p.y2, this.heads[0]);
            ctx.save();
            // 重新赋值（另一个箭头）
            xDiff = -this.x2 + this.x1;
            yDiff = -this.y2 + this.y1;
            angle = Math.atan2(yDiff, xDiff);
            // 调用画箭头的方法
            this.drawArrow(angle, p.x1, p.y1, this.heads[1]);
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

        },

        // 画箭头的方法【三角的位置】【===※===传个heads数组进来】
        drawArrow: function (angle, xPos, yPos, head) {
            // 用来保存最近一次的Canvas的状态和属性【---进栈---】
            this.ctx.save();
            // 空数组为true，（object，用于判断条件时就会被转化为true）
            if (head) {
                // 【线】
                this.ctx.translate(xPos, yPos);
                this.ctx.rotate(angle);
                // 开始一个新路径。非连续路径绘制，都要记得都要执行一句
                this.ctx.beginPath();

                // 将5px移动到线的前面以开始箭头，这样它就不会在前面显示方形线的末端（0,0）
                // 【三角】
                this.ctx.moveTo(this.strokeWidth, 0);
                this.ctx.lineTo(-this.strokeWidth * 2, this.strokeWidth * 2);
                this.ctx.lineTo(-this.strokeWidth * 2, -this.strokeWidth * 2);
                // 闭合路径，会把路径最后位置和开始点直线相邻，形成闭合区域
                this.ctx.closePath();
            }

            this.ctx.fillStyle = this.stroke;
            this.ctx.fill();
            // 用来获取save保存的Canvas之前的状态和属性【---出栈---】
            this.ctx.restore();
        },
    });

    // 【箭头开始的对象】object：起点终点的位置；callback：一个函数里面包含起点终点坐标的方法；
    //   console.log(fabric.LineArrow);
    // 【===函数定义===】
    fabric.LineArrow.fromObject = function (object, callback) {
        callback && callback(new fabric.LineArrow([object.x1, object.y1, object.x2, object.y2], object));
    };

    fabric.LineArrow.async = true;


    // 监听按下鼠标时
    function startLine(x, y, evt) {
        x01 = x;
        y01 = y;
        // console.log('按下鼠标');
        // 是否开始画
        isDown = true;
        // 初始化起点坐标和终点坐标
        var points = [x, y, x, y];
        // 箭头
        LineArrow = new fabric.LineArrow(points, {
            strokeWidth: Tools.Width,
            fill: 'black',
            stroke: 'black',
            originX: 'center',
            originY: 'center',
            // 是否被选中
            selectable: false,
            // 对象缓存：对象不会在画布上重新绘制，而只是将其复制的缓存图像绘制在画布上
            objectCaching: false,
            perPixelTargetFind: true,
            heads: [1, 1]
        });
        // setActiveObject：将指定的对象设置为当前活动对象
        canvas.add(LineArrow).setActiveObject(LineArrow);

    }

    // 监听移动鼠标【传进来终点坐标】
    function continueLine(x, y, evt) {
        // 没画就退出这个方法
        if (!isDown) return;
        // console.log(x, y);
        let lineObj = canvas.getActiveObject();
        let length = Math.hypot(lineObj.height, lineObj.width);   // 线的长度
        // 在画就执行↓【在画一直更新位置】【新位置替换旧位置】【自调用函数】
        canvas.getActiveObject().set({ x2: x, y2: y, long: `${Math.ceil(length / 50)}(m)` });

        // text.set({
        //     left: (x01 + (x - x01) / 2) - text.width / 2,
        //     top: (y01 + (y - y01) / 2) - text.height / 2
        // })
        // console.log(x01 + '====----');
        // 获取选中的对象,设置坐标
        canvas.getActiveObject().setCoords();
        // 渲染方法（所有对canvas的修改，包括在其中添加删除对象，以及对象参数的修改，都需要调用渲染方法才能显示出来）
        canvas.renderAll();

    }

    // 监听抬起鼠标
    function stopLine(x, y, evt) {
        // x02 = x;
        // y02 = y;
        // 图形起点终点
        console.log(x01, y01, '起点---终点', x02, y02);
        let lineObj = canvas.getActiveObject();
        let length = Math.hypot(lineObj.height, lineObj.width);   // 线的长度
        arrowPlus = 50 - (length % 50);
        // console.log(arrowPlus);
        let newLength = length + arrowPlus;   // 不够长则自动加50（1m）
        // console.log(newLength + '++++++++++');
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
        // 重绘
        canvas.renderAll();
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





