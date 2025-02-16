import { drawPoints26 } from './brush/brush26.mjs';
import { drawPoints38 } from './brush/brush38.mjs';
import { drawPoints54 } from './brush/brush54.mjs';
import { EnaPressure } from './ena-pressure.mjs';

// const nativeWidth = 1280; 
const nativeWidth = 640;
const nativeHeight = nativeWidth / 4 * 3;

const devicePixelRatio = 2;

const el = document.createElement('canvas');
el.width = nativeWidth * devicePixelRatio;
el.height = nativeHeight * devicePixelRatio;



el.style.cssText += `width:${nativeWidth}px;height:${nativeHeight}px;`;

document.body.appendChild(el);

const ctx = el.getContext('2d');


ctx.scale(devicePixelRatio, devicePixelRatio);

ctx.fillStyle = 'red';
ctx.font = '8px sans-serif';
ctx.textAlign = 'top';

ctx.globalAlpha = 0.8;

// ctx.shadowColor = '#fff';
// ctx.shadowOffsetX = 0;
// ctx.shadowOffsetY = 0;
// ctx.shadowBlur = 2;
let lastPrintX = 0;
let lastPrintY = 0;

let points = [];

const convPoints = (points) => {
	const newPoints = [];
	for(let i = 0; i < points.length; i += 3){
		newPoints.push(points[i]);
		newPoints.push(points[i + 1]);
		newPoints.push(points[i + 2] * 8);
	}
	return newPoints;
}

const shiftPoints = (points, shiftX, shiftY) => {
	const newPoints = [];
	for(let i = 0; i < points.length; i += 3){
		newPoints.push(points[i] + shiftX);
		newPoints.push(points[i + 1] + shiftY);
		newPoints.push(points[i + 2]);
	}
	return newPoints;
}

const enaPressure = new EnaPressure({
	el,
	nativeWidth,
	nativeHeight,
	// disableLow: true,
	onDown: ({x,y,pressure,less}) => {
		// console.clear();
		console.log('down', x, y, pressure);

		ctx.save();
		ctx.fillStyle = '#FFF';
		ctx.globalAlpha = 0.8;
		ctx.fillRect(0,0,nativeWidth,nativeHeight);
		ctx.restore();

		points = [];

		ctx.fillStyle = less ? 'red' : 'blue';
	},
	onUp: (x,y,pressure) => {
		console.log('up', x, y, pressure);

	},
	onMove: (x,y,pressure) => {
		// console.log('move', x, y, pressure);

		points.push(x);
		points.push(y);
		points.push(pressure);

		ctx.save();


		// // if(calcDistance > 10){
		// 	ctx.fillText(
		// 		Math.floor(pressure * 100), 
		// 		x + 8, 
		// 		y + 3
		// 	);
		// 	lastPrintX = x;
		// 	lastPrintY = y;
		// // }


		const radius = 12;
		
		const shiftX = 40;

		ctx.clearRect(0,0,nativeWidth,nativeHeight);

		const printPoints = convPoints(points);

		drawPoints54(ctx, shiftPoints(printPoints, shiftX * -1, 0), ctx.fillStyle, radius, ctx.globalAlpha );
		
		drawPoints26(ctx, shiftPoints(printPoints,  shiftX, 0) , ctx.fillStyle, radius, ctx.globalAlpha );
		drawPoints38(ctx, printPoints, ctx.fillStyle, radius, ctx.globalAlpha );
		
		
		// ctx.globalAlpha = pressure;
		// const size = pressure * 10;
		// const sizeHalf = size / 2;
		// ctx.fillRect(
		// 	x - sizeHalf,
		// 	y - sizeHalf,
		// 	size,
		// 	size
		// );


		ctx.restore();
	},
});

enaPressure.listen();