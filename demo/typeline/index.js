import DanKe from '../../src/danke.js'
import config from './config'

(async () => {
  const danke = new DanKe('#app', config, null)
  await danke.boot()
})()
