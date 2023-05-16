(function () {

    function changeOpacity() {
        // 透明度だけ変更した色を設定する
        if(Tools.curTool.name == "Pen") {
            canvas.freeDrawingBrush.color = Tools.getColor(Tools.Color);
        }
    }
    // 他のツールに切り替える際に値などを戻す処理を記載
    function selectableOff() {
        canvas.getObjects().forEach(o => o.set('selectable', false));
        canvas.perPixelTargetFind = false;
    }

    var colorTool = {
        "name": "Opacity", // ツールの名称
        "type": "Settings",
        "listeners": {
            // "tap": erase, // タップ時の処理(タップ処理がないものは記載不要)
            "press":  () => { }, // 1点タッチで移動開始時の処理(処理がないものは `() = {}`でよい)
            "move":  () => { }, // 1点タッチで移動中の処理(処理がないものは `() = {}`でよい)
            "release":  () => { } // 1点タッチで移動終了時の処理(処理がないものは `() = {}`でよい)
        },
        "defaultCursor": "default", // オブジェクトをhoverしない時のカーソル
        "hoverCursor": "pointer", // オブジェクトをhoverしている時のカーソル
        // "icon": "tools/opacity/icon.svg", // ツールバーのアイコン画像
        "oneTouch": true, // ツール切り替え時のみの処理の場合 true、ツール切り替え時に処理をしない場合 false
        "onstart": changeOpacity, // oneTouchがtrueの時にツール切り替え時に実行される処理
        "quit": () => { }, // 別のツールに切り替えされる時に、設定を戻す処理
    };
    Tools.add(colorTool);
})();