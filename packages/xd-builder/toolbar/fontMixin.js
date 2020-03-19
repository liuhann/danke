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
      fontSizeOptions: [{
        label: '10',
        value: '10px'
      }, {
        label: '12',
        value: '12px'
      }, {
        label: '14',
        value: '14px'
      },{
        label: '16',
        value: '16px'
      }, {
        label: '18',
        value: '18px'
      }, {
        label: '20',
        value: '20px'
      }, {
        label: '24',
        value: '24px'
      }, {
        label: '28',
        value: '28px'
      }, {
        label: '32',
        value: '32px'
      }, {
        label: '36',
        value: '36px'
      }, {
        label: '40',
        value: '40px'
      }, {
        label: '48',
        value: '48px'
      }]
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
