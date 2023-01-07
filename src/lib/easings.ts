// FROM https://easings.net/

export function easeInBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;

  return c3 * x * x * x - c1 * x * x;
}

export function easeOutElastic(x: number): number {
  const c4 = (2 * Math.PI) / 3;

  if (x <= 0) {
    return 0;
  }
  if (x >= 1) {
    return 1;
  }

  return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}
