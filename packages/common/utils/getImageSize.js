export default async function (file) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = function () {
      resolve({
        width: this.width,
        height: this.height
      })
    }
    image.src = URL.createObjectURL(file)
  })
}
