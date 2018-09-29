export default {
  name: 'scene',
  props: {
    template: {
      type: String
    },
    data: {
      type: Object
    }
  },

  methods: {
    in () {
      this.$refs.scene.in()
    }
  },
  render (h) {
    const vm = this
    return h('scene-' + this.template, {
      props: {
        data: this.data
      },
      on: {
        beginOut: function (args) {
          vm.$emit('begin-out', args)
        },
        outComplete: function (...args) {
          vm.$emit('out-complete', args)
        }
      },
      ref: 'scene'
    }, [])
  }
}
