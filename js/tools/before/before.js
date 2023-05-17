// 立即执行函数
(function () {

  // 撤回上一步方法
  function before() {
    // 先打印看看存图像的set数据（类似数组）
    console.log(canvas.getObjects());
    console.log(canvas.getObjects().length);
    // 拿个变量接收set数据
    let arr = canvas.getObjects();
    // 剩余运算符
    canvas.remove([...arr].pop());
    // 渲染方法（所有对canvas的修改，包括在其中添加删除对象，以及对象参数的修改，都需要调用渲染方法才能显示出来）
    canvas.renderAll();
    // 打印看结果
    console.log(canvas.getObjects());
    // 判断set>=1，则解禁矩形按钮
    if (canvas.getObjects().length === 0 ) {
      const rectbox = document.getElementById('label_Rect');
      const rect = document.getElementById('Rect');
      // console.dir(rect);
      rect.disabled = false;
      rectbox.style.backgroundColor = "#fff";
    }
  }

  function beforeOn() {
    // 先找到所有存的图像，再找最后两个
    const mySet = canvas.getObjects();
    const myArr = Array.from(mySet);   // 将Set对象转换为数组
    const lastTwo = myArr.slice(-2);  // 找到最后两个【如果只有一个该set里面只有一个】
    // 小于2直接删
    if (lastTwo.length < 2) {
      before();
    } else {
      // 【=2走这里】判断后一项id未定义，则不是箭头，可以删
      if (lastTwo[1].id === undefined) {
        before();
      } else {
        // id有东西则判断这两位
        if (lastTwo[0].id === lastTwo[1].id) {
          // console.log('id相等');
          before();
          before();
        }
      }
    }
  }


  // 监听抬起鼠标
  function stopLine(x, y, evt) {
    // 结束
    isDown = false;
  }

  // 添加工具
  var beforeTool = {
    "name": "before",
    "listeners": {
      "press": stopLine,
      "move": stopLine,
      "release": stopLine,
    },
    // 2D图像详情
    "secondary": {
      "name": "before",
      "icon": "tools/before/icon.svg",
      "active": false,
    },
    "icon": "tools/before/icon.svg",
    "oneTouch": true,
    // 点击侧边栏
    "onstart": beforeOn,
  };
  Tools.add(beforeTool);
})();