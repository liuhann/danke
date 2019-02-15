export default {
  name: 'scene',
  props: {
    index: {
      type: Number
    },
    state: {
      type: String
    },
    template: {
      type: String
    },
    data: {
      type: Object
    }
  },

  methods: {
  },

  render (h) {
    return h('scene-' + this.template, {
      props: {
        state: this.state,
        data: this.data,
        index: this.index
      },
      on: {
        beginOut: function (args) {
        },
        outComplete: function (...args) {
        }
      },
      ref: 'scene'
    }, [])
  }
}
