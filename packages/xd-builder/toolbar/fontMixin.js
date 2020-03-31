export default {
  data () {
    return {
      textAlignOptions: [{
        label: '靠左',
        value: 'left'
      }, {
        label: '居中',
        value: 'center'
      }, {
        label: '靠左',
        value: 'right'
      }],
      fontSizeOptions: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 48, 56, 64, 72, 80, 90]
    }
  },
  computed: {
    fontSize: {
      get: function () {
        if (this.selectedTexts.length) {
          return this.selectedTexts[0].style.fontSize
        } else {
          return 14
        }
      },
      set: function (size) {
        for (let element of this.selectedTexts) {
          element.style.fontSize = size
        }
      }
    },

    textAlign: {
      get: function () {
        if (this.selectedTexts.length) {
          return this.selectedTexts[0].style.textAlign
        } else {
          return 14
        }
      },
      set: function (size) {
        for (let element of this.selectedTexts) {
          element.style.textAlign = size
        }
      }
    },

    fontWeightStyle () {
      if (this.selectedTexts.length) {
        return {
          fontWeight: this.selectedTexts[0].style.fontWeight
        }
      } else {
        return {}
      }
    }
  },
  methods: {
    setTextAlignment (align) {
      this.focusedFont.style.align = align
    },

    increaseFontSize (variable) {
      variable.value += 2
    },
    decreaseFontSize (varialbe) {
      varialbe.value -= 2
    },

    toggleFontBold () {
      if (this.selectedTexts.length) {
        let fontWeight = this.selectedTexts[0].style.fontWeight
        fontWeight += 200
        if (fontWeight > 600) {
          fontWeight = 200
        }
        for (let textElement of this.selectedTexts) {
          textElement.style.fontWeight = fontWeight
        }
      }
    }
  }
}
