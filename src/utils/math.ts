export function clamp(v: number, left: number, right: number) {
  return Math.max(left, Math.min(right, v));
}

export function randomBetween(left: number, right: number) {
  return Math.random() * (right - left) + left;
}

export function range(begin: number, end: number): Array<number> {
  const arr: Array<number> = [];
  for (let i = begin; i < end; i++) {
    arr.push(i);
  }
  return arr;
}
