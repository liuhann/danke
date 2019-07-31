export default {
  mounted () {
    const vi = this
    this.eventListener = (e) => {
      if (e.key === 'Delete') {
        if (vi.currentElement && vi.multipleElements.length === 1) {
          vi.deleteElement(this.currentElement)
        }
      }
      if (e.key.toUpperCase() === 'S' && e.ctrlKey) {
        e.preventDefault()
        vi.saveWork()
      }
      if (e.key.toUpperCase() === 'V' && e.ctrlKey) {
        navigator.clipboard.readText().then(text => {
          vi.insertText(text)
        })
      }
    }
    window.addEventListener('keydown', this.eventListener)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.eventListener)
  }
}
