(function () {

    var eraserBrush = null;

    function removeObjects(targets) {
        
        // console.log('all objects');
        // canvas.getObjects().forEach(function(otherObj) {
        //     console.log(otherObj);
        // });

        // console.log('brush object');
        // console.log(eraserBrush);

        // var pathObj = eraserBrush.getPath();

        // canvas.forEachObject(function(object) {
        //     if (object.intersectsWithObject(pathObj)) {
        //       console.log('線がオブジェクトと重なっています');
        //       // 重なっているオブジェクトを処理するためのコードをここに追加する
        //     }
        //   });

        var obj = canvas.freeDrawingBrush
        // canvas.getObjects().forEach(function(otherObj) {
        //     if(fabric.util.intersectSegments(
        //         obj.get('x1'), obj.get('y1'), obj.get('x2'), obj.get('y2'),
        //         otherObj.get('x1'), otherObj.get('y1'), otherObj.get('x2'), otherObj.get('y2')
        //     )) {
        //         console.log('Intersection found:', obj, otherObj);
        //     }
        // });
        // 消しゴムは特殊で普通のイベントと消しゴムのイベントで呼ばれるので、消しゴムの時だけ処理をする
        if (Array.isArray(targets)) {
            // targets.forEach(obj => canvas.remove(obj));
        }
    }

    function erasingModeOn() {
        // console.log('erasingModeOn');
        eraserBrush = new fabric.EraserBrush(canvas);
        canvas.freeDrawingBrush = eraserBrush;
        // canvas.freeDrawingBrush.width = 10;
        canvas.isDrawingMode = true;
        canvas.perPixelTargetFind = true;
    }

    // 他のツールに切り替える際に値などを戻す処理を記載
    function erasingModeOff() {
        // console.log('erasingModeOff');
        canvas.isDrawingMode = false
        canvas.perPixelTargetFind = false;
    }

    var eraserTool = {
        "name": "Eraser",
        "listeners": {
            "press": () => { },
            "move": () => { },
            "release": removeObjects,
        },
        "defaultCursor": "crosshair",
        "hoverCursor": "crosshair",
        "icon": "tools/eraser/icon.svg",
        "oneTouch": true,
        "onstart": erasingModeOn,
        "quit": erasingModeOff
    };
    Tools.add(eraserTool);

})();