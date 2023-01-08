import type { IUpdateable } from "./interfaces/updateable";

class Inputs implements IUpdateable {
  private state: Map<string, Map<string, boolean>> = new Map();
  private pressedButtons: Map<string, Set<string>> = new Map();

  connect() {
    this.state.set("keyboard", new Map());
    this.pressedButtons.set("keyboard", new Set());

    window.addEventListener("keyup", (ev) => {
      this.updateKeyboard(ev.code, false);
    });
    window.addEventListener("keydown", (ev) => {
      this.updateKeyboard(ev.code, true);
    });

    window.addEventListener("gamepadconnected", (event) => {
      console.log("A gamepad connected:");
      console.log(event.gamepad);

      this.state.set(event.gamepad.id, new Map());
      this.pressedButtons.set(event.gamepad.id, new Set());
    });

    window.addEventListener("gamepaddisconnected", (event) => {
      console.log("A gamepad disconnected:");
      console.log(event.gamepad);

      this.state.delete(event.gamepad.id);
      this.pressedButtons.delete(event.gamepad.id);
    });
  }

  updateKeyboard(code: string, isPressed: boolean) {
    const kb = this.state.get("keyboard");
    kb?.set(code, isPressed);
    if (isPressed) {
      this.pressedButtons.get("keyboard")?.add(code);
    } else {
      this.pressedButtons.get("keyboard")?.delete(code);
    }
  }

  isPressed(code: string, id = "keyboard") {
    return this.state.get(id)?.get(code) || false;
  }

  getPressed() {
    return this.pressedButtons;
  }

  anyPressed() {
    for (const src of this.pressedButtons.values()) {
      if (src.size > 0) {
        return true;
      }
    }
    return false;
  }

  updateGamepad(gp: Gamepad) {
    const gpState = new Map<string, boolean>();
    gpState.set("X", gp.buttons[2]?.pressed || false);
    gpState.set("Y", gp.buttons[3]?.pressed || false);
    gpState.set("B", gp.buttons[1]?.pressed || false);
    gpState.set("A", gp.buttons[0]?.pressed || false);

    gpState.set("ArrowLeft", gp.buttons[14]?.pressed || false);
    gpState.set("ArrowRight", gp.buttons[15]?.pressed || false);
    gpState.set("ArrowUp", gp.buttons[12]?.pressed || false);
    gpState.set("ArrowDown", gp.buttons[13]?.pressed || false);

    const pressed = new Set<string>();
    gpState.forEach((isPressed, code) => {
      if (isPressed) {
        pressed.add(code);
      }
    });
    this.pressedButtons.set(gp.id, pressed);
    this.state.set(gp.id, gpState);
  }

  update(dt: number) {
    if (!document.hasFocus()) {
      this.state.forEach((src) => {
        src.clear();
      });
      return;
    }
    const gamepads = navigator.getGamepads();
    gamepads.forEach((gp) => {
      if (gp) {
        this.updateGamepad(gp);
      }
    });
  }

  debug() {
    this.state.forEach((src, name) => {
      src.forEach((isPressed, code) => {
        if (isPressed) {
          console.log(name, code);
        }
      });
    });
  }
}

export const inputs = new Inputs();
