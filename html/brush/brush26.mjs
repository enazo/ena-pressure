import { getAngleRadians } from "./get-y-angle.mjs";




const drawRed = (ctx,x,y)=>{
    ctx.save();
    ctx.fillStyle = 'rgba(255,0,0,0.5)';
    ctx.fillRect(
        x,
        y,
        1,1
    );
    ctx.restore();
}

export const drawPoints26 = (ctx,points,color,defaultLineWidth,alpha)=>{
    ctx.save();

    // const subdivsPoints = subdivs(points);
    const subdivsPoints = points.slice();
    // const subdivsPoints = createSmoothCurvePointsWithWidth(points,0.5,6,Math.max(defaultLineWidth * 0.6,2));


    const length = subdivsPoints.length;
    const pointLength = length / 3;
    const fillPoints = subdivsPoints.slice(0,2);

    for (let i = 0; i < length; i+=3) {
        const pointIndex = i/3;


        
        const beforeX = subdivsPoints[i - 3] || subdivsPoints[0]
        const beforeY = subdivsPoints[i - 2] || subdivsPoints[1]
        
        const afterX = subdivsPoints[i + 3] || subdivsPoints[subdivsPoints.length - 3]
        const afterY = subdivsPoints[i + 4] || subdivsPoints[subdivsPoints.length - 2]


        const angle = getAngleRadians(beforeX,beforeY,afterX,afterY) - Math.PI / 2;



        const width = subdivsPoints[i+2];
        const lineWidth = ( width * 0.5 + 2 ) * defaultLineWidth * 0.25;
        const halfLineWidth = lineWidth / 2;
        
        const moveX = halfLineWidth * Math.cos(angle);
        const moveY = halfLineWidth * Math.sin(angle);
        // console.log('angle',angle,moveX,moveY)


        const x = subdivsPoints[ i     ];
        const y = subdivsPoints[ i + 1 ];

        fillPoints[ pointIndex * 2 + 0 ] = x + moveX;
        fillPoints[ pointIndex * 2 + 1 ] = y + moveY;

        fillPoints[ (pointLength * 2 - pointIndex) * 2 + 0 ] = x - moveX;
        fillPoints[ (pointLength * 2 - pointIndex) * 2 + 1 ] = y - moveY;

        

    }

    ctx.beginPath();


    ctx.moveTo(
        fillPoints[0],
        fillPoints[1]
    );
    for(let i = 2;i<fillPoints.length;i+=2){
        ctx.lineTo(
            fillPoints[i],
            fillPoints[i+1]
        );
        // drawRed(ctx,fillPoints[i],fillPoints[i+1]);
    }

    ctx.closePath();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.strokeStyle = null;
    ctx.globalAlpha = alpha;
    ctx.fill('nonzero');
    ctx.restore();

};