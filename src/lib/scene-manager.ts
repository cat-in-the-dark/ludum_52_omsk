interface IScene {
  activate(): void;
  update(dt: number): void;
  exit(): void;
}

class SceneManager_ {
  current: string;
  next: string;

  constructor(private scenes: Map<string, IScene>) {
    this.current = "";
    this.next = "";
  }

  update(dt: number) {
    if (this.current !== this.next) {
      console.log(`Transition from ${this.current} to ${this.next}`);
      this.scenes.get(this.current)?.exit();
      this.current = this.next;
      this.scenes.get(this.current)?.activate();
    }

    this.scenes.get(this.current)?.update(dt);
  }
}

function SceneManager(scenes) {
  this.scenes = scenes;
  this.currentScene = 0;
  this.prevScene = this.scenes.length;
  this.nextScene = 0;
}

SceneManager.prototype.update = function () {
  this.currentScene = this.nextScene;
  if (this.prevScene !== this.currentScene) {
    if (this.prevScene !== this.scenes.length) {
      this.scenes[this.prevScene].dispose();
    }
    this.scenes[this.currentScene].init();
    this.prevScene = this.currentScene;
  }
  const res = this.scenes[this.currentScene].update();

  if (res) {
    trace("Transition to next scene");
    this.nextScene = (this.currentScene + 1) % this.scenes.length;
  }
};

SceneManager.prototype.draw = function () {
  this.scenes[this.currentScene].draw();
};

module.exports = SceneManager;