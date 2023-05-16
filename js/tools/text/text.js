
(function () {
  
    function putText(x, y, evt) {
      isDown = true;
      var points = [x, y, x, y];
      // 可以创建可编辑文本
      text = new fabric.IText("请键入内容", {
        fontSize: 28,
        left: x,
        top: y - 20,
        fontFamily: '"Arial", "Helvetica", sans-serif',
      });
  
      canvas.add(text);
      // 创建后是否对其进行操作及更改
      Tools.change("Selector");
    }
  
    // 他のツールに切り替える際に値などを戻す処理を記載
    function quit() {
    }
  
    var textTool = {
      "name": "Text",
      "listeners": {
        "tap": putText,
        "press": putText,
        "move": () => {},
        "release": ()=> {},
      },
      "defaultCursor": "text",
      "hoverCursor": "text",
      "icon": "tools/text/icon.svg",
      "quit": quit
    };
    Tools.add(textTool);
  })();