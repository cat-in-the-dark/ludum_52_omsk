export class Vec2 {
  constructor(public x: number = 0, public y: number = 0) {}

  add(other: Vec2): Vec2 {
    return new Vec2(other.x + this.x, other.y + this.y);
  }

  /**
   * Inplace vector scaling
   * @param s scalar
   * @returns scaled vector
   */
  scale(s: number): Vec2 {
    this.x *= s;
    this.y *= s;
    return this;
  }
}
