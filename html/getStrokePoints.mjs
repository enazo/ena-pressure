import { add, dist, isEqual, lrp, sub, uni } from './vec.js';

export function getStrokePoints(points, options = {}) {
  const { 
	streamline = 0.5, 
	size = 16, 
	last: isComplete = false 
} = options;

  if (points.length === 0) return [];

  const t = 0.15 + (1 - streamline) * 0.85;

  let pts = Array.isArray(points[0])
    ? points
    : points.map(({ x, y, pressure = 0.5 }) => [x, y, pressure]);

  if (pts.length === 2) {
    const last = pts[1];
    pts = pts.slice(0, -1);
    for (let i = 1; i < 5; i++) {
      pts.push(lrp(pts[0], last, i / 4));
    }
  }

  if (pts.length === 1) {
    pts = [...pts, [...add(pts[0], [1, 1]), ...pts[0].slice(2)]];
  }

  const strokePoints = [
    {
      point: [pts[0][0], pts[0][1]],
      pressure: pts[0][2] >= 0 ? pts[0][2] : 0.25,
      vector: [1, 1],
      distance: 0,
      runningLength: 0,
    },
  ];

  let hasReachedMinimumLength = false;
  let runningLength = 0;
  let prev = strokePoints[0];
  const max = pts.length - 1;

  for (let i = 1; i < pts.length; i++) {
    const point = isComplete && i === max ? pts[i].slice(0, 2) : lrp(prev.point, pts[i], t);

    if (isEqual(prev.point, point)) continue;

    const distance = dist(point, prev.point);
    runningLength += distance;

    if (i < max && !hasReachedMinimumLength) {
      if (runningLength < size) continue;
      hasReachedMinimumLength = true;
    }

    prev = {
      point,
      pressure: pts[i][2] >= 0 ? pts[i][2] : 0.5,
      vector: uni(sub(prev.point, point)),
      distance,
      runningLength,
    };

    strokePoints.push(prev);
  }

  strokePoints[0].vector = strokePoints[1]?.vector || [0, 0];

  return strokePoints;
}