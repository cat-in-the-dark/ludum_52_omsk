import { inputs } from "../lib/inputs";
import { Vec2 } from "../lib/vec2";
import type { IUpdateable } from "../lib/interfaces/updateable";

type Mapping = {
  left: string;
  right: string;
  up: string;
  down: string;
  dash: string;
};

export class Controls implements IUpdateable {
  constructor(private mapping: Mapping, private id: string) {}

  dir() {
    if (inputs.isPressed(this.mapping.left, this.id)) {
      return new Vec2(-1, 0);
    }
    if (inputs.isPressed(this.mapping.right, this.id)) {
      return new Vec2(1, 0);
    }
    if (inputs.isPressed(this.mapping.up, this.id)) {
      return new Vec2(0, -1);
    }
    if (inputs.isPressed(this.mapping.down, this.id)) {
      return new Vec2(0, 1);
    }
    return new Vec2(0, 0);
  }
  dash() {
    return inputs.isPressed(this.mapping.dash, this.id);
  }

  update(dt: number) {
    //
  }
}

export function newWasdControls() {
  return new Controls(
    {
      left: "KeyA",
      right: "KeyD",
      up: "KeyW",
      down: "KeyS",
      dash: "KeyE",
    },
    "keyboard"
  );
}

export function newArrowControls() {
  return new Controls(
    {
      left: "ArrowLeft",
      right: "ArrowLeft",
      up: "ArrowLeft",
      down: "ArrowLeft",
      dash: "ShiftRight",
    },
    "keyboard"
  );
}

export function newGampePadControls(id: string) {
  return new Controls(
    {
      left: "ArrowLeft",
      right: "ArrowLeft",
      up: "ArrowLeft",
      down: "ArrowLeft",
      dash: "A",
    },
    id
  );
}
