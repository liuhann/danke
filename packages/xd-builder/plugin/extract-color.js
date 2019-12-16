var sourceImg = document.getElementById('img-ColorSource')
this.getPlugin('ColorThief').then(ColorThief => {
  debugger
  var colors = ColorThief.default.calculateElementColors(sourceImg)
  if (colors) {
    this.getElementByName('Rect1').background.colors = [colors[0].rgb]
    this.getElementByName('Text1').text = colors[0].cn
    this.getElementByName('Rect2').background.colors = [colors[1].rgb]
    this.getElementByName('Rect3').background.colors = [colors[2].rgb]
  }
  this.invalidate()
})
