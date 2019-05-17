import initClient from './utils/initClient'
export default {
  async onload (ctx) {
    initClient(ctx)
  }
}
