export default async function (mill) {
  return new Promise(resolve => {
    setTimeout(resolve, mill)
  })
}
