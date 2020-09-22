import axios from 'axios'

export default function initClient (ctx, prefixUrl) {

  const instance = axios.create({
    baseURL: prefixUrl,
    timeout: 100000,
    // transformRequest: [function (data, headers) {
    //   // Do whatever you want to transform the data
    //   headers.common.tokens = ctx.token
    //   return data;
    // }],
    headers: {token: ctx.token}
  });
  ctx.ky = instance
  ctx.get = instance.get
  ctx.put = instance.put
  ctx.post = instance.post
  ctx.patch = instance.patch
  ctx.delete = instance.delete
}
