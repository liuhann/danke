async function checkWebpFeature (feature) {
  return new Promise((resolve, reject) => {
    var kTestImages = {
      lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
      lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
      alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
      animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA'
    }
    // eslint-disable-next-line no-undef
    var img = new Image()
    img.onload = function () {
      var result = (img.width > 0) && (img.height > 0)
      resolve(feature, result)
    }
    img.onerror = function () {
      resolve(feature, false)
    }
    img.src = 'data:image/webp;base64,' + kTestImages[feature]
  })
}

export default checkWebpFeature
