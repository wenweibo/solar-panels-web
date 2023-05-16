// 箭头功能
(function () {
    // 判断是否在画
    var isDown, ctx, LineArrow, points, text, lineObj, longOnePoint, arrowPlus;
    var x01, x02, y01, y02;
    var arrowLineAngle;
    // 默认长度
    var long = ' ';

    // 渲染上下文
    ctx = canvas.getContext("2d");
    /*
     * 声明了一个arrow对象
     */
    // 库里声明了【utils是这个fabricjs下挂的对象，里面有很多方法】
    fabric.LineArrow = fabric.util.createClass(fabric.Line, {
        // 类型
        type: "lineArrow",
        // 初始化
        initialize: function (element, options) {
            // 判断options是否有东西【有】
            options || (options = {});
            this.callSuper("initialize", element, options);
            // ======================================================================
        },

        toObject: function () {
            return fabric.util.object.extend(this.callSuper("toObject"));
        },

        // render：提供、提交、表达、呈现
        _render: function (ctx) {
            this.ctx = ctx;
            this.callSuper("_render", ctx); //没有这句话就是个三角

            // 如果宽度/高度为零或对象不可见，则不渲染
            if ((this.width === 0 && this.height === 0) || !this.visible) return;

            // 计算线点
            let p = this.calcLinePoints();
            // x轴长度
            let xDiff = this.x2 - this.x1;
            // y轴长度
            let yDiff = this.y2 - this.y1;
            // 角度
            let angle = Math.atan2(yDiff, xDiff);
            arrowLineAngle = angle;
            // 调用画箭头的方法
            this.drawArrow(angle, p.x2, p.y2, this.heads[0]);

            ctx.save();
            // 重新赋值（另一个箭头）
            xDiff = -this.x2 + this.x1;
            yDiff = -this.y2 + this.y1;
            angle = Math.atan2(yDiff, xDiff);
            // 调用画箭头的方法
            this.drawArrow(angle, p.x1, p.y1, this.heads[1]);

            // if (Math.abs(p.x2) + Math.abs(p.x1) > 60 || Math.abs(p.y2) + Math.abs(p.y1) > 60) {
            // let text = new fabric.IText("请输入", {
            //   backgroundColor: "#fff",
            //   fontSize: 18,
            //   left: this.x1,
            //   top: this.y1,
            //   fontFamily: "sans-serif",
            // });
            // console.log(text);
            // canvas.add(text);

            // this.ctx.font = "18px sans-serif";
            // this.ctx.rotate(Math.atan2(this.y2 - this.y1, this.x2 - this.x1));
            // this.ctx.fillStyle = "white";
            // this.ctx.fillRect(-30, -15, 62, 30);
            // this.ctx.fillStyle = this.stroke;
            // this.ctx.fillText("请输入", -25, 5);
            // }

            // console.log(this._objects);
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
        // text
        drawText: function () { },
    });

    // 【箭头开始的对象】object：起点终点的位置；callback：一个函数里面包含起点终点坐标的方法；
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
        // 【获取当前时间的时间戳，并将其转换为字符串类型，可以用于生成唯一的ID】
        let id = Date.now().toString();
        // 箭头
        LineArrow = new fabric.LineArrow(points, {
            strokeWidth: Tools.Width,
            fill: "black",
            stroke: "black",
            originX: "center",
            originY: "center",
            // 是否被选中
            selectable: false,
            // 对象缓存：对象不会在画布上重新绘制，而只是将其复制的缓存图像绘制在画布上
            objectCaching: false,
            // 在查找对象时，将使用像素级别的精度来确定鼠标指针是否在对象上(为false，这意味着在查找对象时，只会使用对象的边界框来确定鼠标指针是否在对象上)
            perPixelTargetFind: true,
            heads: [1, 1],
            id: id,
        });
        // setActiveObject：将指定的对象设置为当前活动对象
        canvas.add(LineArrow).setActiveObject(LineArrow);

        // long = getDiagonalLong();
        // console.log(long);
        // 文本
        text = new fabric.Text(long + "(m)", {
            backgroundColor: "#fff",
            fontSize: 18,
            left: x,
            top: y,
            originX: "center",
            originY: "center",
            // textAlign: 'center',
            fontFamily: "sans-serif",
            id: id,
            selectable: false,
            // 将notOptional设置为true，则表示该对象是必需的，不能被删除或清除
            notOptional: true,
            // 设置了该属性，则只有指定类型的对象可以作为该对象的父级
            parentType: "lineArrow",
            // 隐藏文本框【不可见】
            visible: false,
        });

        // console.log(text, LineArrow);
        canvas.add(text);

    }

    // on是指事件监听器，"mouse:down"是指监听鼠标按下事件，function (opt)是指当事件被触发时所执行的函数
    canvas.on("mouse:down", function (opt) {
        // 对象不存在 || 对象类型不是文本框 || 对象父级类型不是箭头  则退出方法
        if (!opt.target || opt.target.type != "i-text" || opt.target.parentType != "lineArrow") {
            return;
        }

        let targetText = opt.target;
        // 将targetText对象设置为当前选中的对象，使其可以被编辑和操作
        canvas.setActiveObject(targetText);
        // 将指定的文本对象设置为编辑模式，以便用户可以编辑文本内容
        targetText.enterEditing();
    });

    canvas.on({
        // 对象移动
        "object:moving": lineArrowChange,
        // 缩放
        "object:scaling": lineArrowChange,
        // 旋转
        "object:rotating": lineArrowChange,
    });

    // 定义一个第一个角度，初始值
    let firstAngle = 0;
    function lineArrowChange(opt) {
        if (opt.target.type != "lineArrow") {
            return;
        }

        let lineArrow = opt.target;
        let targetText = null;
        canvas.getObjects().forEach((element) => {
            if (lineArrow.id == element.id) {
                targetText = element;
            }
        });

        // console.log(lineArrow);
        if (targetText) {
            // 如果文本框有东西，则设置其属性【==== 此处是旋转移动时文本框位置 ====】
            targetText.set({
                // 将 targetText 对象的左边缘与 lineArrow 对象的左边缘对齐，并且将 targetText 对象的中心点向左移动 targetText.width / 2 个像素，以便让 targetText 对象的中心点与 lineArrow 对象的中心点对齐
                left: lineArrow.left,
                // 将 targetText 对象的顶部与 lineArrow 对象的顶部对齐，并且将 targetText 对象的中心点向上移动 targetText.height / 2 个像素，以便让 targetText 对象的中心点与 lineArrow 对象的中心点对齐
                top: lineArrow.top,
                // 将 targetText 对象的旋转角度设置为与 lineArrow 对象相同的角度【判断箭头角度，如果不为0则为true，则是线的角度加初始角度】
                angle: lineArrow.angle ? lineArrow.angle + firstAngle : targetText.angle,
            });
            canvas.remove(targetText);
            canvas.add(targetText);
        }
        // // 重新获取起点终点位置 或 重新获得宽高
        // lineObj = canvas.getActiveObject();
        // // 抬起更改线长度
        // let length1 = Math.hypot(lineObj.height, lineObj.width);   // 线的长度
        // console.log(length1 +'=====================');
        // console.log(lineObj);

    }

    // 监听移动鼠标【传进来终点坐标】
    function continueLine(x, y, evt) {
        // 没画就退出这个方法
        if (!isDown) return;
        // console.log(x, y);
        // 在画就执行↓【在画一直更新位置】【新位置替换旧位置】【自调用函数】
        lineObj = canvas.getActiveObject();
        // console.log(lineObj);
        lineObj.set({ x2: x, y2: y });



        // 得到对角线的方法
        function getDiagonalLong() {
            // 判断箭头线对角线长度，大于一定数值，则文本框可见【开平方根】【考虑绝对值问题】
            let wid = Math.abs(x - x01);
            let hei = Math.abs(y - y01);
            // console.log(x,y,'---',x01,y01);
            // console.log(wid,hei);
            let diagonal = Math.sqrt((wid * wid) + (hei * hei));
            return diagonal;
            // console.log('对角线：'+diagonal);
        }
        let diagonal = getDiagonalLong();
        if (diagonal > 50) {
            text.visible = true;
        } else {
            text.visible = false;
        }
        long = diagonal / 50;
        // 保留一位小数
        longOnePoint = long.toFixed(1);
        // console.log(long);
        // console.log(longOnePoint);

        // 重新set一下把值放进来
        text.set({
            left: lineObj.left,
            top: lineObj.top,
            angle: Math.atan2(y - y01, x - x01) * (180 / Math.PI),
            text: longOnePoint + '(m)',
        });
        // 获取选中的对象,设置坐标
        canvas.getActiveObject().setCoords();
        // 重绘
        canvas.renderAll();
    }

    // 监听抬起鼠标
    function stopLine(x, y, evt) {
        x02 = x;
        y02 = y;
        // 图形起点终点
        console.log(x01, y01, "起点---终点", x02, y02);
        firstAngle = text.angle;
        // 判断文本向上取整，松开鼠标箭头做处理
        
        if (longOnePoint % 1 !== 0) {
            // alert('不可取带小数值哟~已自动给您扩大至1m状态。');
            longInt = Math.ceil(longOnePoint)  // 向上取整
            // set Arrow
            // 抬起更改线长度
            let length = Math.hypot(lineObj.height, lineObj.width);   // 线的长度
            arrowPlus = 50 - (length % 50);
            // console.log(arrowPlus);
            let newLength = length + arrowPlus;   // 不够长则自动加50（1m）
            // console.log(newLength + '++++++++++');
            let stopLineX2 = lineObj.x1 + (newLength * (lineObj.x2 - lineObj.x1)) / length;
            let stopLineY2 = lineObj.y1 + (newLength * (lineObj.y2 - lineObj.y1)) / length;
            lineObj.set({ x2: stopLineX2, y2: stopLineY2 });
            // set Text
            text.set({
                text: longInt + '(m)',
                left: lineObj.left,
                top: lineObj.top,
                angle: Math.atan2(y02 - y01, x02 - x01) * (180 / Math.PI),
            });
        } else {
            longOnePoint = parseInt(longOnePoint);
            text.set({
                text: longOnePoint + '(m)',
            });
        }


        // 结束
        canvas.getActiveObject().set({
            // 它指定是否在下一次渲染调用时重新渲染对象缓存。
            dirty: true,
            // 对象缓存
            objectCaching: true,
        });
        // 自动切换到select工具
        Tools.change("Selector");
        // 重绘
        canvas.renderAll();
        isDown = false;
    }

    // 记载切换到其他工具等的处理【例如关闭自由绘画可以写里面】
    function quit() { }
    // 添加工具
    var arrowTool = {
        name: "arrow",
        listeners: {
            press: startLine,
            move: continueLine,
            release: stopLine,
        },
        defaultCursor: "crosshair",
        hoverCursor: "crosshair",
        icon: "tools/arrow/icon.svg",
        quit: quit,
    };
    Tools.add(arrowTool);
})();
