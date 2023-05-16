(function () {
    let ctx;
    ctx = canvas.getContext("2d");

    let lineLeft = new fabric.Line([400, 400, 400, 407], {
        stroke: Tools.getColor(Tools.Color),
        strokeWidth: Tools.Width,
        selectable: false,
    });
    let lineRight = new fabric.Line([447, 400, 447, 407], {
        stroke: Tools.getColor(Tools.Color),
        strokeWidth: Tools.Width,
        selectable: false,
    });
    // 尺为400-450【50为尺长 === 终点 - 起点 (相当于) 1m == 50】
    let lineLong = new fabric.Line([400, 407, 450, 407], {
        stroke: Tools.getColor(Tools.Color),
        strokeWidth: Tools.Width,
        selectable: false,
    });
    let rulerText = new fabric.Text('单位:1(m)', {
        fontSize: 12,
        left: 402,
        top: 415,
    });
    let rulerGroup = new fabric.Group([lineLeft, lineLong, lineRight, rulerText], {
        left: 40,
        top: 645,
        angle: 0,
        selectable: false,
    });

    canvas.add(rulerGroup);
    // console.log(rulerGroup);


















})();