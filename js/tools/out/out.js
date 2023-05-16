
(function () {

    function rectOn() {
        let canva = canvas.getObjects();
        // console.log(canva);
        // 返回一个包含图片展示的 data URI 
        var imgData = canvas.toDataURL({ format: 'png', quality: 1, width: 2000, height: 2000 });

        const link = document.createElement('a');
        link.download = 'image.png';
        link.href = imgData;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // console.log(imgData);
        // 截取字符串
        // var strDataURI = imgData.substr(22, imgData.length);
        // console.log(strDataURI);
        // // 转二进制
        // var blob = dataURLtoBlob(imgData);
        // console.log(blob);
        // // 这个 URL 的生命周期和创建它的窗口中的 document 绑定
        // var objurl = URL.createObjectURL(blob);
        // console.log(objurl);

        // // 得到按钮
        // var link = document.getElementById('label_out');
        // console.log(link);
        // link.download = "grid1.png";
        // link.href = objurl;

        // function dataURLtoBlob(dataurl) {
        //     var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        //         bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        //     while (n--) {
        //         u8arr[n] = bstr.charCodeAt(n);
        //     }
        //     return new Blob([u8arr], { type: mime });
        // }



        // var imgData = canvas.toDataURL({ format: 'png', quality: 1, width: 20000, height: 4000 });
        // var strDataURI = imgData.substr(22, imgData.length);
        // var blob = dataURLtoBlob(imgData);
        // var objurl = URL.createObjectURL(blob);
        // link.download = "grid1.png";
        // link.href = objurl;
        // link.click();

        // function dataURLtoBlob(dataurl: string) {
        //     var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        //         bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        //     while (n--) {
        //         u8arr[n] = bstr.charCodeAt(n);
        //     }
        // return new Blob([u8arr], { type: mime });
        // }
    }


    // 监听抬起鼠标
    function stopLine(x, y, evt) {
        // 结束
        isDown = false;
    }
    // 记载切换到其他工具等的处理【例如关闭自由绘画可以写里面】
    function quit() {
    }
    // 添加工具
    var out = {
        "name": "out",
        "listeners": {
            "press": stopLine,
            "move": stopLine,
            "release": stopLine,
        },
        // 2D图像详情
        "secondary": {
            "name": "out",
            "icon": "tools/out/icon.svg",
            "active": false,
        },
        "icon": "tools/out/icon.svg",
        "oneTouch": true,
        // 点击侧边栏
        "onstart": rectOn,
        "quit": quit
    };
    Tools.add(out);

})();