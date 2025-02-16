export const getYAngle = function (cx, cy, x2, y2) {
    var x = Math.abs(cx - x2);
    var y = Math.abs(cy - y2);
    var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    var tan = x / y;
    var radina = Math.atan(tan);//用反三角函数求弧度
    var angle = Math.floor(180 / (Math.PI / radina)) || 0;//将弧度转换成角度
    if (x2 > cx && y2 > cy) {// point在第四象限
        angle = (-1) * angle;
    }
    if (x2 == cx && y2 > cy) {// point在y轴负方向上
        angle = 0;
    }
    if (x2 < cx && y2 > cy) {//point在第三象限
        angle = angle;
    }
    if (x2 < cx && y2 == cy) {//point在x轴负方向
        angle = 90;
    }
    if (x2 < cx && y2 < cy) {// point在第二象限
        angle = 180 - angle;
    }
    if (x2 == cx && y2 < cy) {//point在y轴正方向上
        angle = 180;
    }
    if (x2 > cx && y2 < cy) {//point在第一象限
        angle = 180 + angle;
    }
    if (x2 > cx && y2 == cy) {//point在x轴正方向上
        angle = -90;
    }
    return angle;
}



export const getAngleRadians = (p1x,p1y,p2x,p2y) => Math.atan2(p2y - p1y, p2x - p1x);