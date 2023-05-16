// 矩形功能

(function () {
    var rect, isDown;
    var downPoint = null // 按下鼠标时的坐标
    var upPoint = null // 松开鼠标时的坐标
    console.log(downPoint);
    console.log(upPoint);
    // 鼠标在画布上按下
    // function canvasMouseDown(e) {
    //     // 鼠标左键按下时，将当前坐标 赋值给 downPoint。{x: xxx, y: xxx} 的格式
    //     downPoint = e.absolutePointer
    // }
    // console.log(canvasMouseDown());


    // 鼠标在画布上松开
    // function canvasMouseUp(e) {
    //     // 绘制矩形的模式下，才执行下面的代码
    //     if (currentType === 'rect') {
    //         // 松开鼠标左键时，将当前坐标 赋值给 upPoint
    //         upPoint = e.absolutePointer
    //         // 调用 创建矩形 的方法
    //         createRect()
    //     }
    // }
    // 开始的点
    // var top = Math.min(downPoint.y, upPoint.y)
    // var left = Math.min(downPoint.x, upPoint.x)
    // var width = Math.abs(downPoint.x - upPoint.x)
    // var height = Math.abs(downPoint.y - upPoint.y)

    // console.log(top,'---',left,'---',width,'---',height);

    // 监听按下鼠标时
    function startRect(x, y, x1, y1, evt) {
        // 是否开始画
        isDown = true;
        // 开始的点、结束的点
        var points = [x, y, x1, y1];
        var top = Math.min(y, y1)
        var left = Math.min(x, x1)
        var width = Math.abs(x - x1)
        var height = Math.abs(y - y1)
        console.log(points);


        // 创建fabric矩形对象
        rect = new fabric.Rect(points, top, left, width, height, {
            top: top, 
            left: left, 
            width: width, 
            height: height,
            // 笔触宽度
            strokeWidth: Tools.Width,
            // 笔触填充颜色
            fill: 'transparent',
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
        canvas.add(rect);
    }

    // 监听移动鼠标
    function continueRect(x, y, evt) {
        // 没画就退出这个方法
        if (!isDown) return;
        // 在画就执行↓【在画一直更新位置】
        rect.set({ x2: x, y2: y });
        // 渲染方法（所有对canvas的修改，包括在其中添加删除对象，以及对象参数的修改，都需要调用渲染方法才能显示出来）
        canvas.renderAll();
    }

    // 监听抬起鼠标
    function stopRect(x, y, evt) {
        // 结束
        isDown = false;
    }





    // 记载切换到其他工具等的处理【例如关闭自由绘画可以写里面】
    function quit() {
    }
    // 添加工具
    var rectangleTool = {
        // 工具名字
        "name": "rectangle",
        // 监听
        "listeners": {
            // 按下、移动、抬起【方法】
            "press": startRect,
            "move": continueRect,
            "release": stopRect,
        },
        // 默认光标
        "defaultCursor": "crosshair",
        // 触摸光标
        "hoverCursor": "crosshair",
        // svg图标
        "icon": "tools/rectangle/icon.svg",
        // 退出？
        "quit": quit
    };
    Tools.add(rectangleTool);
})();