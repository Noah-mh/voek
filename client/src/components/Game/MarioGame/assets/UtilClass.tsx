export class Util {
  static imageCache: { [key: string]: HTMLImageElement } = {};

  static loadImg(imgSrc: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.src = imgSrc;
      img.onload = function () {
        Util.imageCache[imgSrc] = img;
        resolve(img);
      };
      img.onerror = reject;
    });
  }

  static loadImgResources(resourcesArr: string[], callback: () => void) {
    let promiseArr: Promise<HTMLImageElement>[] = [];
    resourcesArr.forEach(function (res) {
      promiseArr.push(Util.loadImg(res));
    });
    Promise.all(promiseArr).then(function () {
      callback();
    });
  }

  static sleep(ms: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }
}
