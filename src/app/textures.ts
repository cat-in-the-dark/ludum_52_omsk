export type TexturesManager = {
  logo: HTMLImageElement;
  tractors: [
    HTMLImageElement,
    HTMLImageElement,
    HTMLImageElement,
    HTMLImageElement
  ];
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
  const trac1 = await loadImage("tractor_01.png");
  const trac2 = await loadImage("tractor_02.png");
  const trac3 = await loadImage("tractor_03.png");
  const trac4 = await loadImage("tractor_04.png");

  return {
    logo: logo,
    tractors: [trac1, trac2, trac3, trac4],
  };
}
