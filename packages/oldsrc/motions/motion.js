import mojs from 'mo-js'

/**
 * motion one el with motion name and other opts
 * @param el
 * @param name motion name
 * @param opts include name, from , to .etc
 * @returns {Promise<any>}
 */
export async function motion (el, name, opts) {
  return new Promise((resolve, reject) => {
    if (opts.name) {
      const tween = new mojs.Tween({
        duration: opts.dura,
        onUpdate: (progress) => {
          if (name === 'ZoomIn') {
            el.style.transform = 'scale(' + (((1 - progress) * (opts.from - opts.to)) + opts.to) + ')'
          }
        },
        onComplete: () => {
          resolve()
        }
      })
      tween.play()
    } else {
      resolve()
    }
  })
}

const MotionPlugin = {}

MotionPlugin.install = function (Vue, options) {
  Vue.mixin({
    methods: {
      motion
    }
  })
}

export default MotionPlugin
