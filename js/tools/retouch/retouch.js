
(function () {


    function drawingModeOn() {
        // 笔刷功能的API
        canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
        // 启动自由绘画模式
        canvas.isDrawingMode = true;
        
        //     canvas.freeDrawingBrush.color = Tools.hexToRGB("#FFFFFF", 1);
           
        
        // canvas.freeDrawingBrush.width = Tools.Width;
        // if(Tools.Color != null) {
        //     canvas.freeDrawingBrush.color = Tools.getColor(Tools.Color);
        // }
        
        // 笔刷大小
        canvas.freeDrawingBrush.width = Tools.Width;
        // 
        // 'path:created', function(options) {
        //     var path = options.path;
        //     if (path) {
        //       canvas.remove(path);
        //       canvas.renderAll();
        //     }

        // canvas = window._canvas = new fabric.Canvas('layer1');
        // canvas.isDrawingMode = 1;
        // canvas.freeDrawingBrush.width = 10;
        // canvas.renderAll();

        // //eraser function
        // function eraser() {
        //     canvas.freeDrawingBrush.color = "white"; // if "rgba(0,0,0,0)", not work
        //     canvas.on('path:created', function (opt) {
        //         opt.path.globalCompositeOperation = 'destination-out';
        //         canvas.renderAll();
        //     });
        // }

        // //drawing function
        // function draw() {
        //     canvas.freeDrawingBrush.color = "black";
        //     canvas.on('path:created', function (opt) {
        //         opt.path.globalCompositeOperation = 'source-over';
        //         canvas.renderAll();
        //     });
        // }
        // 'path:created' 当用户在画布上创建了一条路径时，该事件将被触发。例如在用户创建路径后更改路径的属性或者将路径添加到画布中。
        // canvas.freeDrawingBrush.color = "white";
        // canvas.on('path:created', function (opt) {
        //     // alert(111)
        //     console.log(opt);
        //     // 设置Canvas的全局合成操作，将其设置为destination-out表示新绘制的图形将会擦除已有的图形。
        //     opt.path.globalCompositeOperation = 'destination-out';
        //     canvas.renderAll();
        // });

        // // function draw(){
        // canvas.freeDrawingBrush.color = "black";
        // canvas.on('path:created', function (opt) {
        //     // 表示新绘制的图形将会覆盖在之前绘制的图形之上。
        //     opt.path.globalCompositeOperation = 'source-over';
        //     canvas.renderAll();
        // });
        // }
    }

    // 记载切换到其他工具时返回值等的处理
    function drawingModeOff() {
        // 关闭自由绘画
        canvas.isDrawingMode = false
    }

    var retouchTool = {
        "name": "Retouch",
        "listeners": {
            "press": () => { },
            "move": () => { },
            "release": () => { },
        },
        "defaultCursor": "crosshair",
        "hoverCursor": "crosshair",
        "icon": "tools/retouch/icon.svg",
        "oneTouch": true,
        "onstart": drawingModeOn,
        "quit": drawingModeOff
    };
    Tools.add(retouchTool);

})();