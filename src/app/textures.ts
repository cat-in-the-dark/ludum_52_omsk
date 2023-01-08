export type TexturesManager = {
  logo: HTMLImageElement;
};

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (ev) => {
      reject(ev);
    };
  });
}

export async function setupTextures(): Promise<TexturesManager> {
  const logo = await loadImage("logo.png");

  return {
    logo: logo,
  };
}
