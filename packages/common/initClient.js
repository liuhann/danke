import ky from 'ky'
function randomRangeId (num) {
  let returnStr = ''
  const charStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < num; i++) {
    let index = Math.round(Math.random() * (charStr.length - 1))
    returnStr += charStr.substring(index, index + 1)
  }
  return returnStr
}

export default function initClient (ctx) {
  let token = window.localStorage.getItem('token')
  if (!token) {
    token = randomRangeId(10)
    window.localStorage.setItem('token', token)
  }
  const client = ky.extend({
    prefixUrl: 'http://www.danke.fun/api/',
    throwHttpErrors: false,
    headers: {
      'token': token
    }
  })
  ctx.ky = client
  ctx.get = client.get
  ctx.put = client.put
  ctx.post = client.post
  ctx.delete = client.delete
}
