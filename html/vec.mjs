export function neg(A) {
  return [-A[0], -A[1]];
}

export function add(A, B) {
  return [A[0] + B[0], A[1] + B[1]];
}

export function sub(A, B) {
  return [A[0] - B[0], A[1] - B[1]];
}

export function mul(A, n) {
  return [A[0] * n, A[1] * n];
}

export function div(A, n) {
  return [A[0] / n, A[1] / n];
}

export function per(A) {
  return [A[1], -A[0]];
}

export function dpr(A, B) {
  return A[0] * B[0] + A[1] * B[1];
}

export function isEqual(A, B) {
  return A[0] === B[0] && A[1] === B[1];
}

export function len(A) {
  return Math.hypot(A[0], A[1]);
}

export function len2(A) {
  return A[0] * A[0] + A[1] * A[1];
}

export function dist2(A, B) {
  return len2(sub(A, B));
}

export function uni(A) {
  return div(A, len(A));
}

export function dist(A, B) {
  return Math.hypot(A[1] - B[1], A[0] - B[0]);
}

export function med(A, B) {
  return mul(add(A, B), 0.5);
}

export function rotAround(A, C, r) {
  const s = Math.sin(r);
  const c = Math.cos(r);
  const px = A[0] - C[0];
  const py = A[1] - C[1];
  const nx = px * c - py * s;
  const ny = px * s + py * c;
  return [nx + C[0], ny + C[1]];
}

export function lrp(A, B, t) {
  return add(A, mul(sub(B, A), t));
}

export function prj(A, B, c) {
  return add(A, mul(B, c));
}