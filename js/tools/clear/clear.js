// 立即执行函数
(function () {
    // 点击的时候清除
    function rectOn() {
        // 画一个对象就会存里面
        canvas.getObjects().forEach(o => canvas.remove(o));
    }

    // 监听抬起鼠标
    function stopLine(x, y, evt) {
        // 结束
        isDown = false;
    }
    // 记载切换到其他工具时返回值等的处理
    function quit() {
    }
    // 添加工具
    var clearTool = {
        "name": "clear",
        "listeners": {
            "press": stopLine,
            "move": stopLine,
            "release": stopLine,
        },
        // 2D图像详情
        "secondary": {
            "name": "clear",
            "icon": "tools/clear/icon.svg",
            "active": false,
        },
        // "defaultCursor": "crosshair",
        "icon": "tools/clear/icon.svg",
        "oneTouch": true,
        // 点击侧边栏
        "onstart": rectOn,
        "quit": quit,
    };
    Tools.add(clearTool);

})();

