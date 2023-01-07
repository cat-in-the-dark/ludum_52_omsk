import type { Vec2 } from "./vec2";

export class Rect {
  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number
  ) {}

  get minX() {
    return this.x;
  }

  get maxX() {
    return this.x + this.w;
  }

  get minY() {
    return this.y;
  }

  get maxY() {
    return this.y + this.h;
  }
}

export function rectIsIntersect(a: Rect, b: Rect) {
  return (
    a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY
  );
}

export function rectContainsPoint(point: Vec2, box: Rect) {
  return (
    point.x >= box.minX &&
    point.x <= box.maxX &&
    point.y >= box.minY &&
    point.y <= box.maxY
  );
}
