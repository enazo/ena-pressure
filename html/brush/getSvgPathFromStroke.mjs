
const average = (a, b) => (a + b) / 2

export function getSvgPathFromStroke(points) {
	const max = points.length

	if (!max) return '';
	

	let result = `M${average(points[0], points[points.length - 2])},${average(points[1], points[points.length - 1])}Q`

	for (let i = 0; i < max; i += 2) {
		const ax = points[i]
		const ay = points[i + 1]
		const bx = points[i + 2] || points[0];
		const by = points[i + 3] || points[1];
		result += `${ax},${ay} ${average(ax, bx)},${average(ay, by)} `
	}

	return result
}



export function getSvgPathFromStrokeOpen(points, z = false) {
	const max = points.length - 2

	if (!max) return ''
	

	let result = `M${average(points[0], points[2])},${average(points[1], points[3])}Q`

	for (let i = 2; i < max; i += 2) {
		const ax = points[i]
		const ay = points[i + 1]
		const bx = points[i + 2] || points[0];
		const by = points[i + 3] || points[1];
		result += `${ax},${ay} ${average(ax, bx)},${average(ay, by)} `
	}

	// if (z) result += 'Z'

	return result
}
