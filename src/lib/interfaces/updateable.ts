export interface IUpdateable {
  draw(dt: number): void;
  update(dt: number): void;
}