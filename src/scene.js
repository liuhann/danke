export default {
  name: 'scene',
  props: {
    index: {
      type: Number
    },
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
        data: this.data,
        index: this.index
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
