import initClient from './initClient'
export default {
    async onload (ctx) {
        initClient(ctx)
    }
}