import template from 'lodash.template'
// mill -> 12:03.23
function formatAudioSecond (second) {
  return new Date(second * 1000).toISOString().replace(/.*(\d{2}:\d{2}.\d{2}).*/, '$1')
}

function formatAudioSecondShow (second) {
  return new Date(second * 1000).toISOString().replace(/.*(\d{2}:\d{2}).*/, '$1')
}

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

function templateStr (str, data) {
  const compiled = template(str)
  return compiled(data)
}

export {
  templateStr,
  fileExtension,
  randomRangeId,
  shortid,
  formatAudioSecond,
  formatAudioSecondShow
}
