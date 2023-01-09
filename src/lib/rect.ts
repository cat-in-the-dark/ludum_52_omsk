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
