var sourceImg = document.getElementById('img-ColorSource')
this.getPlugin('ColorThief').then(ColorThief => {
  var colors = ColorThief.default.calculateElementColors(sourceImg)
  if (colors) {
    this.getElementByName('Rect1').background.colors = [colors[0].rgb]
    this.getElementByName('Text1').text = colors[0].cn
    this.getElementByName('Rect2').background.colors = [colors[1].rgb]
    this.getElementByName('Rect3').background.colors = [colors[2].rgb]
    this.getElementByName('Rect4').background.colors = [colors[3].rgb]
    this.getElementByName('Rect5').background.colors = [colors[4].rgb]
    this.getElementByName('Rect6').background.colors = [colors[5].rgb]
    this.getElementByName('Rect7').background.colors = [colors[6].rgb]
    this.getElementByName('Rect8').background.colors = [colors[7].rgb]
  }
  this.invalidate()
})
