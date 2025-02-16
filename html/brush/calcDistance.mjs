
export const calcDistance = (x1, y1, x2, y2) => {
	let xDiff = x2 - x1; // 计算两个点的横坐标之差
	let yDiff = y2 - y1;
	return Math.pow(xDiff * xDiff + yDiff * yDiff, 0.5);
};