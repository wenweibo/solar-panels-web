// 工具条对象
var Tools = {};
// 工具列表 {"toolName" : {toolObject}}
Tools.list = {};
Tools.curTool = null;
Tools.isSingle = false;
Tools.Color = [0, 0, 0, 1]; // rgba  默认值
// 工具默认粗细
Tools.Width = 3;

let initMobileScale = 1; // 放大率初始值【移动端缩放初始化】

// 设置
Tools.server_config = {
    BLOCKED_TOOLS: []  // 不添加的工具名称
};

/**
 * 工具添加处理【newTool是个对象】
 */
Tools.add = function (newTool) {
    // 检查工具是否有问题
    if (Tools.isBlocked(newTool)) return;

    // 向工具添加新工具
    Tools.register(newTool);

    // 在屏幕上添加工具图标【====定义一个添加图标的方法====】
    Tools.HTML.addTool(newTool.name, newTool.icon, newTool.iconHTML, newTool.oneTouch, newTool);

    // 切换到最初添加的工具
    if (Tools.curTool == null && Object.keys(Tools.list).length > 0) {
        Tools.change(Object.entries(Tools.list)[0][0])
    }
};

/**
 * 确认工具名称是否有问题的处理【==== 定义一个判断名称的方法 ====】
 */
Tools.isBlocked = function toolIsBanned(tool) {
    if (tool.name.includes(",")) throw new Error("Tool Names must not have a comma");
    return Tools.server_config.BLOCKED_TOOLS.includes(tool.name);
};

/**
 * 添加工具【---- 添加工具方法 ----】
 */
Tools.register = function registerTool(newTool) {
    // 判断工具名是否有问题
    if (Tools.isBlocked(newTool)) return;

    // 判断工具是否已存在
    if (newTool.name in Tools.list) {
        console.log("Tools.add: The tool '" + newTool.name + "' is already" +
            "in the list. Updating it...");
    }

    // 添加到工具列表
    Tools.list[newTool.name] = newTool;
};

/**
 * 在屏幕上添加工具图标（工具名称，工具图片路径，工具对象）
 */
Tools.HTML = {
    addTool: function (toolName, toolIcon, toolIconHTML, oneTouch, tool) {

        if (!(tool.type && tool.type == "Settings")) {
            // 单击工具图标时的处理【可以一直点击的状态】
            var callback = function () {
                // 判断工具为撤销时
                if (tool.name != "before") {
                    // 工具切换
                    Tools.change(toolName);
                }

            };
            var callback1 = function () {
                // 判断工具为撤销时
                if (tool.name == "before") {
                    tool.onstart();
                }
            };

            // 判断工具是否为提交/导出【可以一直点击的状态】
            var callback02 = function () {
                // 判断工具为撤销时
                if (tool.name == "out") {
                    tool.onstart();
                }
            };

            // 添加按钮【单选框】
            var input = $("<input>", {
                type: "radio",
                "class": "radio",
                name: "tools",
                id: toolName,
                value: toolName
            });
            // jQuery点击事件【点击input，切换工具】
            input.on("change", callback);
            input.on("click", callback1);
            // jQuery点击事件【点击out，切换工具】
            input.on("click", callback02);
            // 创建label标签
            var label = $("<label></label>", {
                "class": "tool_btn",
                "for": toolName,
                id: "label_" + toolName
            });
            // 插入图标
            var icon = $("<img>", {
                src: "js/" + toolIcon
            });
            icon.css('max-width', '100%');
            // label标签后面添加图标
            label.append(icon);
            // 在页面div中添加单选框和label（图标）
            $(".UI-area").append(input);
            $(".UI-area").append(label);
        } else if (tool.name == "Color") {
            // 单击工具图标时的处理
            var callback = function (color) {
                // 工具切换
                if (tool.oneTouch) {
                    tool.onstart(color);
                }

            };

            // 制作Color工具按钮部分的HTML。
            //希望能重新做得很好。
            //作为机制，colorLabel被点击时的
            //只看callback的部分就好了。
            var label = $("<label></label>", {
                "class": "tool_btn",
                "for": toolName,
                id: "label_" + toolName
            });
            label.css('align-items', 'flex-start');

            var span = $("<span></span>", {
                "class": "tool_btn tool-color",
            });
            span.css('align-items', 'flex-start');
            span.css('height', '40px');
            span.css('-webkit-box-shadow', 'none');
            span.css('box-shadow', 'none');
            span.css('width', 'auto');

            var span2 = $("<span></span>", {});
            span2.css('display', 'flex');
            span.append(span2);

            if (tool.colors && tool.colors[0]) {

                var colorLabel = $("<label></label>", {
                    "class": "tool_btn",
                    "for": toolName,
                    id: "label_" + toolName
                });

                colorLabel.css('background-color', Tools.getColor(tool.colors[0]));

                span2.append(colorLabel);

                var span3 = $("<span></span>", {
                    "class": "color-list"
                });

                span2.append(span3);

                for (let i = 0; i < tool.colors.length; i++) {
                    colorLabel = $("<label></label>", {
                        "class": "tool_btn",
                        "for": toolName,
                        id: "label_" + toolName + i,
                        value: tool.colors[i]
                    });

                    colorLabel.css('background-color', Tools.getColor(tool.colors[i]));
                    colorLabel.css('display', 'inherit');
                    colorLabel.css('margin', '0px 5px');

                    // 单击颜色时的处理
                    // 选择的value='255,255,0'
                    // 数字数组=[255,255,255,0]的形式
                    // 使用Tools.getColor函数，转换为rgba（255,255,255，0）
                    // 不要忘记更改Opacity工具的数值
                    colorLabel.on("click", function () {
                        // var color = $(this).attr('value').split(',').map(Number);
                        var color = $(this).attr('value').split(',').map(Number);
                        $("#label_" + tool.name).css('background-color', Tools.getColor(color));
                        // $('#Opacity').val(color[3] * 10);
                        callback(color);
                    });

                    span3.append(colorLabel);
                }
            }
            $(".UI-area").append(span);
            /* 
            * ------------- 判断线条粗细 ------------- 
             */
        } else if (tool.name == "Size") {
            // 单击工具图标时的处理
            var callback = function (opt) {
                // 工具切换
                if (tool.oneTouch) {
                    // 简单地传递数值
                    tool.onstart(parseInt(opt.target.value, 10) || 1);
                }
            };

            // 制作笔和线的粗细变更工具的按钮部分的HTML。
            // 希望你能重新做得很好。
            // 作为机制，input变更时的
            // 我想只看callback的部分就好了。
            var input = $("<input>", {
                type: "range",
                "class": toolName,
                name: toolName,
                id: toolName,
                "min": 1,
                "max": 10,
                value: Tools.Width,
            });
            // 点击的时候，有个change的方法
            input.on("change", callback);

            var label = $("<label></label>", {
                "class": "tool_btn",
                "for": toolName,
                id: "label_" + toolName
            });

            var icon = $("<img>", {
                src: "js/" + toolIcon
            });
            icon.css('max-width', '100%');

            label.append(icon);

            var span = $("<span></span>", {
                "class": "tool-size"
            });
            span.css('display', 'flex');
            span.append(label);
            span.append(input);

            $(".UI-area").append(span);
            /* 透明度 */
        } else if (tool.name == "Opacity") {
            // ツールアイコンをクリックした時の処理
            var callback = function (opt) {
                // ツール切り替え
                // input type=rangeの設定をしやすいように
                // 0~10のの範囲で値を設け、10で割ることで、
                // 0~1の範囲になるよう調整している。
                var opacity = (parseInt(opt.target.value, 10) || 1) / 10;

                // colorの配列のOpacityの値を変更する
                if (Tools.Color) {
                    Tools.Color[3] = opacity;
                }

                if (tool.oneTouch) {
                    tool.onstart();
                }
            };

            // 線の透明度変更ツールのボタンの部分のHTMLを作る。
            // いい感じに作り直してほしいです。
            // 仕組みとしては、inputが変更されたときの
            // callbackの部分だけ見てもらえれば良いと思います。
            var input = $("<input>", {
                type: "range",
                "class": toolName,
                name: toolName,
                id: toolName,
                "min": 0,
                "max": 10,
                value: Tools.Width,
            });
            input.on("change", callback);

            var label = $("<label></label>", {
                "class": "tool_btn",
                "for": toolName,
                id: "label_" + toolName
            });

            var icon = '<svg viewBox="0 0 8 8"><pattern id="opacityPattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">                <rect x="0" y="0" width="2" height="2" fill="black"></rect>                <rect x="2" y="2" width="2" height="2" fill="black"></rect>                <rect x="2" y="0" width="2" height="2" fill="#eeeeee"></rect>                <rect x="0" y="2" width="2" height="2" fill="#eeeeee"></rect>            </pattern>            <circle cx="4" cy="4" id="opacityIndicator" r="3.5" fill="url(#opacityPattern)" opacity="1"></circle>        </svg>'

            label.append(icon);

            var span = $("<span></span>", {
                "class": "tool-opacity"
            });
            span.css('display', 'flex');

            span.append(label);
            span.append(input);

            $(".UI-area").append(span);

        }
    },
    changeTool: function (toolName) {
        $("#" + toolName).prop('checked', true);
    },
    clickTool: function (toolName) {
        $("#" + toolName).onclick(() => {
            tool.onstart();
        })
    },
};

/**
 * 色取得(不透明度を含む)
 */
Tools.getColor = function (colors) {
    return `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]})`;
}

/**
 * 工具切换处理
 */
Tools.change = function (toolName) {
    var newTool = Tools.list[toolName];
    var oldTool = Tools.curTool;
    // 如果新工具名不存在
    if (!newTool) throw new Error("Trying to select a tool that has never been added!");
    // 如果工具名===旧工具则退出
    if (newTool === oldTool) return;

    reset_tool();

    if (oldTool) oldTool.quit();

    if (newTool.oneTouch) {
        newTool.onstart();
    }

    // 更新GUI
    canvas.defaultCursor = newTool.defaultCursor || "auto";
    canvas.hoverCursor = newTool.hoverCursor || "auto";

    Tools.curTool = newTool;

    Tools.HTML.changeTool(toolName);
};


// FabricJS实例生成     【创建canvas对象】
var canvas = new fabric.Canvas('canvas', {
    fireRightClick: true, // 启用右键单击
    stopContextMenu: true, // 右键单击时隐藏菜单
    // backgroundColor: 'lightgrey'
    // 背景色
    backgroundColor: '#ffffff'
});


// FabricJS事件发生时的函数调用设置
// 鼠标滚轮事件
canvas.on('mouse:wheel', zoom);

// 鼠标单击开始事件
canvas.on('mouse:down', function (opt) {

    // 删除工具为Selector=true
    // 2点触摸被选择的情况下不能删除
    // 作为当时的对应，在mobile中也检测到的mouse:down事件中
    // 进行删除处理
    if (Tools.curTool.name == 'Eraser') {
        Tools.curTool.listeners.tap();
    }
    if (isEnablePCEvent(opt)) {
        drawStart(opt, Tools.curTool.listeners.press);
    }
});



// 鼠标移动事件
canvas.on('mouse:move', function (opt) {
    if (isEnablePCEvent(opt)) {
        drawMove(opt, Tools.curTool.listeners.move);
    }
});

// 鼠标单击结束事件
canvas.on('mouse:up', function (opt) {
    if (isEnablePCEvent(opt)) {
        drawEnd(opt, Tools.curTool.listeners.release);
    }
});

function isEnablePCEvent(opt) {
    return getMode(opt.e) == 0 && Tools.curTool;
}

function isEnableMobileEvent(opt) {
    return getMode(opt) == 1 && Tools.curTool;
}

// 生成HammerJS实例【移动端适配】
var mc = new Hammer.Manager(canvas.upperCanvasEl);

// 点击事件信息
var tap = new Hammer.Tap({
    event: 'singletap'
});

// 单点触摸事件获取信息
var singlepan = new Hammer.Pan({
    event: 'pan',
    direction: Hammer.DIRECTION_ALL,
    threshold: 5,
    pointers: 1
});

// 多点触摸事件获取信息
var pinch = new Hammer.Pinch({
    threshold: 0
});

// 将事件设置为HammerJS
mc.add(tap);
mc.add(singlepan);
mc.add(pinch);

// 无法识别时的切换性的家伙（要调查）
singlepan.recognizeWith(pinch);
pinch.requireFailure(singlepan);

// HammerJS事件发生时的函数调用
// 抽头事件
mc.on("singletap", function (opt) {
    if (isEnableMobileEvent(opt) && Tools.curTool.listeners.tap) {
        tapMobile(opt, Tools.curTool.listeners.tap);
    }
});

// 单触开始事件
mc.on("panstart", function (opt) {
    if (isEnableMobileEvent(opt)) {
        Tools.isSingle = true;
        drawStartMobile(opt, Tools.curTool.listeners.press);
    }
});

// 单触拖动事件
mc.on("panmove", function (opt) {
    if (isEnableMobileEvent(opt)) {
        drawMoveMobile(opt, Tools.curTool.listeners.move);
    }
});

// 单触结束活动
mc.on("panend", function (opt) {
    if (isEnableMobileEvent(opt)) {
        drawEndMobile(opt, Tools.curTool.listeners.release);
        Tools.isSingle = false;
    }
});

// 两点触摸开始活动
mc.on("pinchstart", function (opt) {
    if (isEnableMobileEvent(opt) && canvas.getActiveObject() == null && !Tools.isSingle) {
        drawStartMobileMulti(opt);
    }
});

// 两点触摸移动活动
mc.on("pinchmove pinchin pinchout", function (opt) {
    if (isEnableMobileEvent(opt) && canvas.getActiveObject() == null && !Tools.isSingle) {
        drawMoveMobileMulti(opt);
    }
});

// 两点触摸结束活动
mc.on("pinchend", function (opt) {
    if (isEnableMobileEvent(opt) && canvas.getActiveObject() == null && !Tools.isSingle) {
        drawEndMobileMulti(opt);
    }
    // 1本の途中で2本に切り替わると1本の終わりが走らないことがあるので、ここでフラグを修正
    Tools.isSingle = false;
});

// window读取时的处理
window.addEventListener("load", init);





/**
 * CANVAS初始设置
 */
function init() {
    // 指定canvas的大小
    canvas.setHeight(window.outerHeight);
    canvas.setWidth(window.outerWidth);

    // tools_init();
    // changeTool();
}

/**
 * 切换工具时返回上一个工具对canvas所做的更改
 */
function reset_tool() {
    canvas.isDrawingMode = false; // 绘制线条模式
    canvas.selection = false; // 选择模式
    canvas.discardActiveObject();
    canvas.requestRenderAll();

    // 禁用所有对象
    canvas.getObjects().forEach(o => o.set('selectable', false));

}


/**
 * 缩放处理（PC）
 */
function zoom(opt) {
    var delta = opt.e.deltaY; // 获取鼠标滚轮移动量【deltaY 属性在向下滚动时返回正值，向上滚动时返回负值，否则为 0。】
    var zoom = canvas.getZoom(); // 获取zoom对象
    zoom *= 0.999 ** delta; // 计算zoom值

    if (zoom > 20) zoom = 20; // 控制zoom的最大值
    if (zoom < 1) zoom = 1; // 控制zoom的最小值

    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom); // 用于以光标为中心zoom的offset

    opt.e.preventDefault();
    opt.e.stopPropagation();
}

/**
 * 缩放处理（移动端）
 */
function zoomMobile(evt) {
    zoom = initMobileScale * evt.scale; // zoomの値を計算

    if (zoom > 20) zoom = 20; // zoomの最大を制御
    if (zoom < 1) zoom = 1; // zoomの最小を制御

    canvas.zoomToPoint({ x: evt.center.x, y: evt.center.y }, zoom); // カーソルを中心にzoomするためのoffset

    evt.preventDefault();
    evt.srcEvent.stopPropagation();
}

/**
 * 开始绘制（PC）
 */
function drawStart(opt, listener) {
    var evt = opt.e;
    var pointer = canvas.getPointer();
    var x = pointer.x;
    var y = pointer.y;

    // 右键单击时移动处理
    if (evt.button === 2) {
        var obj = { isDrawingMode: canvas.isDrawingMode }
        holdParam(obj);

        // 需要关闭临时绘制功能
        canvas.isDrawingMode = false; // 绘制线条模式
        canvas.allowTouchScrolling = true;
        canvas.selection = false;

        canvas.lastPosX = evt.clientX;
        canvas.lastPosY = evt.clientY;


    } else {
        listener(x, y, evt);
    }
}

/**
 * 绘制时（PC）
 */
function drawMove(opt, listener) {
    var evt = opt.e;
    var pointer = canvas.getPointer();
    var x = pointer.x;
    var y = pointer.y;

    // 画布允许触摸滚动
    if (canvas.allowTouchScrolling) {
        var e = opt.e;
        var vpt = canvas.viewportTransform;

        vpt[4] += e.clientX - canvas.lastPosX;
        vpt[5] += e.clientY - canvas.lastPosY;
        canvas.requestRenderAll();
        canvas.lastPosX = e.clientX;
        canvas.lastPosY = e.clientY;
    } else {
        listener(x, y, evt);
    }
}

/**
 * 绘制结束(PC)
 */
function drawEnd(opt, listener) {
    var evt = opt.e;
    var pointer = canvas.getPointer();
    var x = pointer.x;
    var y = pointer.y;

    canvas.setViewportTransform(canvas.viewportTransform);// 如果没有这个，选择器就会发生位置偏移

    if (canvas.allowTouchScrolling) {
        canvas.allowTouchScrolling = false;
        restoreParam();
    }

    listener(x, y, evt);
}


/**
 * tap处理【移动端】
 */
function tapMobile(evt, listener) {
    // 如果没有这个，直线选择的位置就会偏移
    canvas.lastPosX = evt.center.x;
    canvas.lastPosY = evt.center.y;

    evt.target = canvas.upperCanvasEl;
    evt.srcEvent.changedTouches = [{ clientX: evt.srcEvent.clientX, clientY: evt.srcEvent.clientY }];
    var pointer = canvas.getPointer(evt.srcEvent);
    var x = pointer.x;
    var y = pointer.y;

    canvas.renderAll();

    listener(x, y, evt);
}

/**
 * 描画開始(单触)
 */
function drawStartMobile(evt, listener) {

    // 如果没有这个，直线选择的位置就会偏移
    canvas.lastPosX = evt.center.x;
    canvas.lastPosY = evt.center.y;

    evt.target = canvas.upperCanvasEl;
    evt.srcEvent.changedTouches = [{ clientX: evt.srcEvent.clientX, clientY: evt.srcEvent.clientY }];
    var pointer = canvas.getPointer(evt.srcEvent);
    var x = pointer.x;
    var y = pointer.y;

    listener(x, y, evt);
}

/**
 * 描画中(单触)
 */
function drawMoveMobile(evt, listener) {
    evt.target = canvas.upperCanvasEl;
    evt.srcEvent.changedTouches = [{ clientX: evt.srcEvent.clientX, clientY: evt.srcEvent.clientY }];
    var pointer = canvas.getPointer(evt.srcEvent);
    var x = pointer.x;
    var y = pointer.y;

    listener(x, y, evt);
}

/**
 * 描画終了(单触)
 */
function drawEndMobile(evt, listener) {
    canvas.setViewportTransform(canvas.viewportTransform)
    evt.target = canvas.upperCanvasEl;
    evt.srcEvent.changedTouches = [{ clientX: evt.srcEvent.clientX, clientY: evt.srcEvent.clientY }];
    var pointer = canvas.getPointer(evt.srcEvent);

    var x = pointer.x;
    var y = pointer.y;

    listener(x, y, evt);
}

/**
 * 描画開始(多点接触)
 */
function drawStartMobileMulti(evt) {

    // 二点タッチで未確定の点(線の最初)を書いてしまうので、未確定のものをクリアするための処理
    canvas.clearContext(canvas.contextTop);

    // 移動処理
    // 一時的に描く機能をオフにする必要がある
    canvas.isDrawingMode = false; // 線を描くモード
    canvas.allowTouchScrolling = true;
    canvas.selection = false;

    // 禁用所有对象（否则可以选择）
    canvas.getObjects().forEach(o => o.set('selectable', false));
    canvas.discardActiveObject().renderAll();

    if (Tools.curTool.oneTouch) {
        Tools.curTool.quit();
    }

    canvas.lastPosX = evt.center.x;
    canvas.lastPosY = evt.center.y;

    // 現状の拡大率を取得する
    initMobileScale = canvas.getZoom();
}

/**
 * 描画中(マルチタッチ)
 */
function drawMoveMobileMulti(evt) {
    if (canvas.allowTouchScrolling) {
        var vpt = canvas.viewportTransform;

        vpt[4] += evt.center.x - canvas.lastPosX;
        vpt[5] += evt.center.y - canvas.lastPosY;

        zoomMobile(evt);

        canvas.requestRenderAll();

        canvas.lastPosX = evt.center.x;
        canvas.lastPosY = evt.center.y;

    }
}

/**
 * 描画終了(マルチタッチ)
 */
function drawEndMobileMulti(evt) {
    canvas.setViewportTransform(canvas.viewportTransform);
    canvas.allowTouchScrolling = false;

    if (Tools.curTool.oneTouch) {
        Tools.curTool.onstart();
    }
}

/**
 * 获取事件是PC还是移动
 * 0: PC
 * 1: モバイル
 * -1: 没有对应（因为活动根据库的不同而不同，所以有其他的情况）
 */
function getMode(e) {

    if (e.clientX != undefined && e.clientY != undefined) {
        return 0;
    }

    if (e.pointerType != undefined && e.pointerType == 'touch') {
        return 1;
    }

    return -1;
}

var config = {}

/**
 * 临时保存当前参数
 */
function holdParam(obj) {
    config.isDrawingMode = obj.isDrawingMode
}

/**
 * 返回临时保存的参数
 */
function restoreParam() {
    canvas.isDrawingMode = config.isDrawingMode
}