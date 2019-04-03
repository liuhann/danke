import { shortid } from '../../packages/utils/string'
import ky from 'ky/index'

export default function initClient (ctx) {
  let token = window.localStorage.getItem('dankeToken')
  if (!token) {
    token = shortid(12)
    window.localStorage.setItem('dankeToken', token)
  }
  const client = ky.extend({
    prefixUrl: 'http://www.danke.fun/api/',
    throwHttpErrors: false,
    searchParams: {
      'token': token
    },
    hooks: {
      afterResponse: [
        response => {
          // You could do something with the response, for example, logging.
          if (response.status === 200) {
            return response
          } else {
            if (response.status === 401) {
              ctx._router.replace('/login')
            } else {
              throw new Error()
            }
            throw new Error()
          }
          // Or return a `Response` instance to overwrite the response.
          // return new Response('A different response', {status: 200});
        }
      ]
    }
  })
  ctx.ky = client
  ctx.get = client.get
  ctx.post = client.post
  ctx.delete = client.delete
}
