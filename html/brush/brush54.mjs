
import { calcDistance } from "./calcDistance.mjs";
import { getAngleRadians } from "./get-y-angle.mjs";
import { getSvgPathFromStroke } from "./getSvgPathFromStroke.mjs";

const ONE = Math.PI * 2;
const RightAngle = Math.PI / 2;
export const drawPoints54 = (ctx,points,color,defaultLineWidth,alpha)=>{

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

    // points = pointsArrangeByLength3(points,0.9);

    const subdivsPoints = points.slice();
	// const subdivsPoints = createSmoothCurvePointsWithWidth(points,0.3,6,Math.max(defaultLineWidth * 0.6,2));

    // subdivsPoints[2] = 0;
    // subdivsPoints[subdivsPoints.length - 1] = 0;



    const length = subdivsPoints.length;
    const pointLength = length / 3;
    const forMiddleLength = length / 2;
    const fillPoints = [];

    const startW = subdivsPoints[2];
    const endW = subdivsPoints[length - 1];

    const pointDistances = [];

    const pointWidths = [];

    for (let i = 0; i < length; i+=3) {
        const pointIndex = Math.floor(i/3);
        if(pointIndex === 0 ){
            pointDistances[pointIndex] = 0;
        }else{
            pointDistances[pointIndex] = pointDistances[pointIndex - 1] + calcDistance(
                subdivsPoints[i - 3],
                subdivsPoints[i - 2],
                subdivsPoints[i    ],
                subdivsPoints[i + 1],
            );
        }

        const pointWIndex = i + 2;
        const width = (
            (subdivsPoints[pointWIndex - 6] || startW) + 
            (subdivsPoints[pointWIndex - 3] || startW) + 
            (subdivsPoints[pointWIndex]) + 
            (subdivsPoints[pointWIndex + 3] || endW) + 
            (subdivsPoints[pointWIndex + 6] || endW) 
        ) / 5;
        pointWidths[pointIndex] = (width * 0.66 + 1);
    }
    const allLineDistance = pointDistances[pointDistances.length - 1];
    const halfLineDistance = allLineDistance / 2;


    // console.log('pointDistances',pointDistances)
    // console.log('pointWidths',pointWidths)
    for (let i = 0; i < length; i+=3) {
        const pointIndex = Math.floor(i/3);


        // const width = subdivsPoints[i+2];
        const width = pointWidths[pointIndex];

        let scaleWidth = Math.abs(pointDistances[pointIndex] - halfLineDistance) / halfLineDistance;
        // scaleWidth = 1 - scaleWidth; 
        // scaleWidth = 1 - Math.pow(scaleWidth,4);
        scaleWidth = scaleWidth * 0.3 + 0.7;


        // const lineWidth = fixPressureLineWidth(width);
        const lineWidth = width * defaultLineWidth * 0.25 * scaleWidth;
        // const lineWidth = subdivsPoints[i+2] * defaultLineWidth * 0.25;

        
        
        const beforeX = subdivsPoints[i - 3] || subdivsPoints[0]
        const beforeY = subdivsPoints[i - 2] || subdivsPoints[1]
        
        const afterX = subdivsPoints[i + 3] || subdivsPoints[subdivsPoints.length - 3]
        const afterY = subdivsPoints[i + 4] || subdivsPoints[subdivsPoints.length - 2]

        const x = subdivsPoints[ i     ];
        const y = subdivsPoints[ i + 1 ];

        const halfLineWidth = lineWidth / 2;
        const angle = getAngleRadians(beforeX,beforeY,afterX,afterY) - RightAngle;
        // const angle = originAngle * 0.8 + ( Math.PI ) * 0.2;
        const diffWidth = halfLineWidth * (
            0.5 + 
            0.3 +

            Math.pow(
                Math.abs(
                    Math.abs(angle - RightAngle / 2) / ONE % 0.5 - 0.25
                ) 
                / 
                0.25
            ,1.5)
            * 0.5
        );

        // console.log(angle,diffWidth);

        const moveX = diffWidth * Math.cos(angle);
        const moveY = diffWidth * Math.sin(angle);
        // console.log('angle',angle,moveX,moveY)


        fillPoints[ pointIndex * 2 + 0 ] = x + moveX;
        fillPoints[ pointIndex * 2 + 1 ] = y + moveY;



        fillPoints[ (pointLength * 2 - pointIndex - 1) * 2 + 0 ] = x - moveX;
        fillPoints[ (pointLength * 2 - pointIndex - 1) * 2 + 1 ] = y - moveY;

        
    }

    const path = getSvgPathFromStroke(fillPoints,'z');
    // console.log(path);
    const p = new Path2D(path);

    ctx.fillStyle = ctx.strokeStyle;
    ctx.strokeStyle = null;
    ctx.globalAlpha = alpha;
    ctx.fill(p,'nonzero');
    ctx.restore()

};