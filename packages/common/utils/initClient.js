import ky from 'ky'

export default function initClient (ctx, prefixUrl) {
  const client = ky.extend({
    prefixUrl,
    throwHttpErrors: false,
    hooks: {
      beforeRequest: [(options) => {
        options.headers.append('token', ctx.token)
      }]
    }
  })
  ctx.ky = client
  ctx.get = client.get
  ctx.put = client.put
  ctx.post = client.post
  ctx.delete = client.delete
}
