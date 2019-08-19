import initClient from './utils/initClient'
import checkWebpFeature from './utils/checkWebP'
export default {
  async onload (ctx) {
    ctx.supportWebp = await checkWebpFeature('loss')
    initClient(ctx)
  }
}
