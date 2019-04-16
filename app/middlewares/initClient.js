import ky from 'ky'

export default function initClient (ctx) {
  let token = window.localStorage.getItem('token') || 'none'
  const client = ky.extend({
    prefixUrl: 'http://www.danke.fun/api/',
    throwHttpErrors: false,
    searchParams: {
      'token': token
    }
  })
  ctx.ky = client
  ctx.get = client.get
  ctx.put = client.put
  ctx.post = client.post
  ctx.delete = client.delete
}
