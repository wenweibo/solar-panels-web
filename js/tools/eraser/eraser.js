(function () {

    function selectableOn() {
        // 将画布中的所有对象的selectable属性设置为可选中。对于Canvas中的每个对象，将其属性'selectable'设置为true。【点击图标切换工具，所有元素可被选中】
        canvas.getObjects().forEach(o => o.set('selectable', true));
        // 精细查找。只有点到框才可以，避免矩形里面有图把内部的元素给删除。
        canvas.perPixelTargetFind = true;
    }
    // 记载切换到其他工具时返回值等的处理
    function selectableOff() {
        canvas.getObjects().forEach(o => o.set('selectable', false));
        canvas.perPixelTargetFind = false;
    }
    // 删除选中的方法
    function erase(x, y, evt) {
        /* 【canvas.getActiveObject()是选中了的对象、canvas.getObjects()是所有对象】 */
        // console.log(canvas.getActiveObject());
        // console.log(canvas.getObjects());
        // 先判断选取的元素是否存在并且有id
        if (canvas.getActiveObject() && 'id' in canvas.getActiveObject()) {
            // console.log(canvas.getActiveObject().id);
            const halfArrow = canvas.getActiveObject().id;
            // 删除选中的这个
            canvas.remove(canvas.getActiveObject());
            // 遍历数组对象，并且把同值id的一起删掉
            canvas.getObjects().forEach(obj => {
                if (obj.id === halfArrow) {
                    // 找到含有同值id属性的元素删除
                    canvas.remove(obj);
                }
            });
        } else {
            canvas.remove(canvas.getActiveObject());
        }
    }

    var eraserTool = {
        "name": "Eraser",
        "listeners": {
            "tap": erase, // 移动端tap时的处理（不需要记载没有tap处理的处理）
            "press": erase, // 移动端长按开始移动时的处理（没有处理的可以是`（）={}`）
            "move": () => { }, // 1点触摸移动中的处理（没有处理的可以是`（）={}`）
            "release": () => { } // 1点触摸移动结束时的处理（没有处理的可以是`（）={}`）
        },
        "defaultCursor": "default", // 默认光标
        "hoverCursor": "pointer", // 悬停对象时的光标
        "icon": "tools/eraser/icon.svg",
        "oneTouch": true, // 【移动端单指触摸？】仅在工具切换时进行处理时为真，在工具切换时不进行处理时为假
        "onstart": selectableOn, // 当oneTouch为真时切换工具时执行的操作
        "quit": selectableOff // 切换到其他工具时返回设置的过程
    };
    Tools.add(eraserTool);
})();