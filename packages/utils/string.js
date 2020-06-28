function randomRangeId (num) {
  let returnStr = ''
  const charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < num; i++) {
    let index = Math.round(Math.random() * (charStr.length - 1))
    returnStr += charStr.substring(index, index + 1)
  }
  return returnStr
}

function shortid (length) {
  return randomRangeId(length || 6)
}

function fileExtension (fname) {
  return fname.slice((fname.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase()
}

export {
  fileExtension,
  randomRangeId,
  shortid
}
