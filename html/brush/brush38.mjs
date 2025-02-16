

import { getSvgPathFromStroke } from "./getSvgPathFromStroke.mjs";
import { getAngleRadians } from "./get-y-angle.mjs";


const halfPI = Math.PI * 0.5;
const angle11 = Math.PI / 24;
const angle22 = Math.PI / 16;
export const drawPoints38 = (ctx,points,color,defaultLineWidth,alpha)=>{
    
    ctx.save();

    if(points.length === 3){
        ctx.beginPath();
        ctx.arc(
            points[0],
            points[1],
            Math.min(3,defaultLineWidth,points[2] * defaultLineWidth * 0.1), 
            0, 
            2 * Math.PI
        );
        ctx.fillStyle = ctx.strokeStyle;
        ctx.strokeStyle = null;
        ctx.globalAlpha = alpha;
        ctx.fill('nonzero');
        ctx.restore();
        return;
    }


	if(points.length === 6){
        ctx.beginPath();
        ctx.moveTo(
            points[0],
            points[1]
        );
        ctx.lineTo(
            points[3],
            points[4]
        );
		ctx.lineWidth = points[2] * defaultLineWidth * 0.1

        ctx.globalAlpha = alpha;
        ctx.stroke();
        ctx.restore();
        return;
    }

    // const subdivsPoints = subdivs(points);
    const _points = points.slice();
    // const subdivsPoints = createSmoothCurvePointsWithWidth(points,0.5,6,Math.max(defaultLineWidth * 0.6,2));

    // console.log(subdivsPoints.length / 3);

    const length = _points.length;
    const pointLength = length / 3;
    let fillPoints = [];


    let lastAngle90;

    let lastX;
    let lastY;

    let lineALastX;
    let lineALastY;

    let lineBLastX;
    let lineBLastY;

    let subdivsPoints = [];

    const startW = _points[2];
    const endW = _points[_points.length - 1];
    for(let i = 0; i < _points.length; i += 3){
        
        const w = (
            ( _points[ i + 2 - 12 ] || startW ) + 
            ( _points[ i + 2 - 9 ] || startW ) + 
            ( _points[ i + 2 - 6 ] || startW ) + 
            ( _points[ i + 2 - 3 ] || startW ) + 
            ( _points[ i + 2     ] ) + 
            ( _points[ i + 2 + 3 ] || endW ) + 
            ( _points[ i + 2 + 6 ] || endW ) + 
            ( _points[ i + 2 + 9 ] || endW ) + 
            ( _points[ i + 2 + 12 ] || endW )
        ) / 9;
        subdivsPoints.push(
            _points[i  ],
            _points[i+1],
            w
        );
    }

    // console.log(subdivsPoints)
    // subdivsPoints = reducePointsWidthWithDistance(subdivsPoints,defaultLineWidth / 2);

    // console.log(subdivsPoints)

    const subdivsPointsLength = subdivsPoints.length;

    for (let i = 0; i < subdivsPointsLength; i+=3) {
        const pointIndex = i/3;


        const lineWidth = subdivsPoints[i+2] * defaultLineWidth * 0.25;

        
        const beforeX = subdivsPoints[i - 3] || subdivsPoints[0]
        const beforeY = subdivsPoints[i - 2] || subdivsPoints[1]
        
        const afterX = subdivsPoints[i + 3] || subdivsPoints[subdivsPoints.length - 3]
        const afterY = subdivsPoints[i + 4] || subdivsPoints[subdivsPoints.length - 2]

        const x = subdivsPoints[ i     ];
        const y = subdivsPoints[ i + 1 ];

        const halfLineWidth = lineWidth / 2;
        const angle = getAngleRadians(beforeX,beforeY,afterX,afterY)
        const angle90 = angle - Math.PI / 2;
        const moveX = halfLineWidth * Math.cos(angle90);
        const moveY = halfLineWidth * Math.sin(angle90);
        // console.log('angle',angle,moveX,moveY)


        // fillPoints[ pointIndex * 2 + 0 ] = x + moveX;
        // fillPoints[ pointIndex * 2 + 1 ] = y + moveY;

        // fillPoints[ (pointLength * 2 - pointIndex) * 2 + 0 ] = x - moveX;
        // fillPoints[ (pointLength * 2 - pointIndex) * 2 + 1 ] = y - moveY;

        // 起始补上远端点
        if(pointIndex === 0){
            // const angle30 = angle - Math.PI * 0.25;
            // fillPoints.push(
            //     x - halfLineWidth * Math.cos(angle30),
            //     y - halfLineWidth * Math.sin(angle30),
            // )
            fillPoints.push(
                x - halfLineWidth * Math.cos(angle),
                y - halfLineWidth * Math.sin(angle),
            )
            // const angle60 = angle + Math.PI * 0.25;
            // fillPoints.push(
            //     x - halfLineWidth * Math.cos(angle60),
            //     y - halfLineWidth * Math.sin(angle60),
            // )
        }


        const lineAX = x + moveX;
        const lineAY = y + moveY;
        
        
        const lineBX = x - moveX;
        const lineBY = y - moveY;


        fillPoints.push(
            lineAX,
            lineAY,
        );

        fillPoints.unshift(
            lineBX,
            lineBY,
        );
        

        // 结束补上远端点
        if( length === (i + 3) ){
            // const angle60 = angle + Math.PI * 0.25;
            // fillPoints.unshift(
            //     x + halfLineWidth * Math.cos(angle60),
            //     y + halfLineWidth * Math.sin(angle60),
            // )
            fillPoints.unshift(
                x + halfLineWidth * Math.cos(angle),
                y + halfLineWidth * Math.sin(angle),
            )
            // const angle30 = angle - Math.PI * 0.25;
            // fillPoints.unshift(
            //     x + halfLineWidth * Math.cos(angle30),
            //     y + halfLineWidth * Math.sin(angle30),
            // )
        }

        lastX = x;
        lastY = y;

        lineALastX = lineAX;
        lineALastY = lineAY;

        lineBLastX = lineBX;
        lineBLastY = lineBY;

        lastAngle90 = angle90;
    }
    
    // fillPoints = [
    //     ...fillPoints.slice(6),
    //     ...fillPoints.slice(0,6),
    // ]
    const path = getSvgPathFromStroke(fillPoints,'z');
    // console.log(path);
    const p = new Path2D(path);

    ctx.fillStyle = ctx.strokeStyle;
    ctx.strokeStyle = null;
    ctx.globalAlpha = alpha;
    ctx.fill(p,'nonzero');


    ctx.restore();
};