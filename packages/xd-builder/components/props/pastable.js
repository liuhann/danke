export default {
  data () {
    return {
      copied: null,
      ctxKey: 'pasteKey',
      propKey: 'propKey'
    }
  },
  created () {
    if (this.ctx[this.ctxKey]) {
      this.copied = this.ctx[this.ctxKey]
    }
  },
  methods: {
    pasteStyle () {
      if (this.copied) {
        this[this.propKey] = JSON.parse(JSON.stringify(this.copied))
        this.copied = null
      }
    },
    copyStyle () {
      this.copied = {
        [this.ctxKey]: JSON.parse(JSON.stringify(this[this.propKey]))
      }
      this.ctx[this.ctxKey] = JSON.parse(JSON.stringify(this[this.propKey]))
    }
  }
}
