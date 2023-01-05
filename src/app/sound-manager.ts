export class Track {
  node: AudioBufferSourceNode;
  context: AudioContext;
  offset: number;
  duration: number;

  constructor(
    node: AudioBufferSourceNode,
    context: AudioContext
  ) {
    this.node = node;
    this.context = context;
    this.offset = 0;
    this.duration = this.node.buffer?.duration || 0;
  }

  start() {
    this.node.start();
    this.offset = this.context.currentTime;
    console.log(this.context.outputLatency);
  }

  stop() {
    this.node.stop();
  }

  progress() {
    return (this.context.currentTime - this.offset) % this.duration;
  }
}

async function loadSoundBuffer(context: AudioContext, url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await context.decodeAudioData(arrayBuffer);
  const node = new AudioBufferSourceNode(context, {
    buffer: audioBuffer,
  });
  node.connect(context.destination);
  return node;
}

async function newTrack(
  context: AudioContext,
  url: string,
) {
  console.log(`Loading ${url}`);
  const node = await loadSoundBuffer(context, url);
  console.log(`Done loading ${url}`);
  return new Track(node, context);
}

export class SoundManager {
  context: AudioContext;
  tracks: Map<string, Track>;

  constructor() {
    this.context = new AudioContext();
    this.context.suspend();
    this.tracks = new Map();
  }

  resume() {
    this.context.resume();
  }

  async load(urls: Array<string>) {
    const promises = urls.map((url) => newTrack(this.context, url));
    const tracks = await Promise.all(promises);
    for (let i = 0; i < urls.length; i++) {
      const name = urls[i];
      const track = tracks[i];
      if (name && track) {
        this.tracks.set(name, track);
      }
    }
    return tracks;
  }
}