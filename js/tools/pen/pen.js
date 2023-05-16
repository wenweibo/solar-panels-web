// 立即执行函数
(function () {


    function drawingModeOn() {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        // 自由绘画属性【鼠标点击和移动都会被记录】
        canvas.isDrawingMode = true
        canvas.freeDrawingBrush.width = Tools.Width;
        if(Tools.Color != null) {
            canvas.freeDrawingBrush.color = Tools.getColor(Tools.Color);
            // canvas.freeDrawingBrush.color = '#fff';
        }
    }

    // 去切换其他工具需要关闭自由绘画
    function drawingModeOff() {
        canvas.isDrawingMode = false
    }

    var penTool = {
        "name": "Pen",
        "listeners": {
            "press": () => { },
            "move": () => { },
            "release": () => { },
        },
        "defaultCursor": "crosshair",
        "hoverCursor": "crosshair",
        "icon": "tools/pen/icon.svg",
        "oneTouch": true,
        "onstart": drawingModeOn,
        "quit": drawingModeOff
    };
    Tools.add(penTool);

})();