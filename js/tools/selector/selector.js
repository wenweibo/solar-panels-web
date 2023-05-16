
(function () {


    function selectableOn() {
        // 解除禁用所有对象【可以去选择图像】
        // canvas.getObjects().forEach(o => o.set('selectable', true));
        // 遍历
        canvas.getObjects().forEach((o) => {
            // 如果notOptional属性为false，则表示该对象是可选的，可以被删除或编辑
            if (!o.notOptional) {
                o.set("selectable", true);
            }
        });
        // 使用 selection 属性设置画布所需的选择模式
        canvas.selection = true;
    }

    // 记载切换到其他工具时返回值等的处理
    function selectableOff() {
        // 禁用所有对象【画好了就不可以再动了】
        canvas.getObjects().forEach(o => o.set('selectable', false));
        canvas.selection = false;
    }

    var penTool = {
        "name": "Selector",
        "listeners": {
            "press": () => { },
            "move": () => { },
            "release": () => { },
        },
        "defaultCursor": "default",
        "hoverCursor": "all-scroll",
        "icon": "tools/selector/icon.svg",
        "oneTouch": true,
        "onstart": selectableOn,
        "quit": selectableOff
    };
    Tools.add(penTool);

})();