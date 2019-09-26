function randomRangeId (num) {
  let returnStr = ''
  const charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < num; i++) {
    let index = Math.round(Math.random() * (charStr.length - 1))
    returnStr += charStr.substring(index, index + 1)
  }
  return returnStr
}

function getToken () {
  let token = window.localStorage.getItem('token')
  if (!token) {
    token = randomRangeId(16)
    window.localStorage.setItem('token', token)
  }
  return token
}

function resetToken () {
  let token = randomRangeId(10)
  window.localStorage.setItem('token', token)
  return token
}

export {
  getToken,
  resetToken
}
