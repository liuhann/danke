import DanKe from '../../src/danke.js'
import config from './scenes'

(async () => {
  const danke = new DanKe('#app', config)
  await danke.boot()
})()
