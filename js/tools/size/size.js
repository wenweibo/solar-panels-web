(function () {

    function changeSize(size) {
        if(Tools.curTool.name == "Pen") {
            canvas.freeDrawingBrush.width = size;
        }

        Tools.Width = size;
    }

    var sizeTool = {
        "name": "Size", // 工具名称
        "type": "Settings",
        "listeners": {
            // "tap": erase, // 点击时的处理（不需要记载没有点击处理的处理）
            "press":  () => { }, // 1点触摸开始移动时的处理（没有处理的可以是`（）={}`）
            "move":  () => { }, // 1点触摸移动中的处理（没有处理的可以是`（）={}`）
            "release":  () => { } // 1点触摸移动结束时的处理（没有处理的可以是`（）={}`）
        },
        "defaultCursor": "default", // 不覆盖对象时的光标
        "hoverCursor": "pointer", // 悬停对象时的光标
        // "icon": "tools/eraser/icon.svg", // 工具栏图标图像
        "oneTouch": true, // 仅在工具切换时进行处理时为真，在工具切换时不进行处理时为假
        "onstart": changeSize, // 当oneTouch为真时切换工具时执行的操作
        "quit": () => { }, // 切换到其他工具时返回设置的过程
        "icon": "tools/size/icon.svg",
    };
    Tools.add(sizeTool);
})();