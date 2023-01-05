import { SoundManager } from "./sound-manager";

export const SOUND = {
};

export const MUSIC = {
};

export async function setupSounds() {
  const sm = new SoundManager();
  await sm.load(Object.values(SOUND));
  const musics = await sm.load(Object.values(MUSIC));
  musics.forEach((track) => track.node.loop = true);
  sm.resume();
  return sm;
}