// 根据image blob 获取图片大小
export default async function getImageSize (blob) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    img.onload = function () {
      resolve({
        width: this.width,
        height: this.height
      })
    }
  })
}