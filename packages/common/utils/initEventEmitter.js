import EventEmitter from 'events'
export default function initEventEmitter (ctx) {
  const ee = new EventEmitter()
  ctx.ee = ee
  ctx.on = ee.on
  ctx.emit = ee.emit
}
