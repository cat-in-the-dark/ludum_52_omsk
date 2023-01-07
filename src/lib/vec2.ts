export class Vec2 {
  constructor(public x: number = 0, public y: number = 0) {}

  add(other: Vec2): Vec2 {
    return new Vec2(other.x + this.x, other.y + this.y);
  }
}
