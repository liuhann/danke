if (!window.chapters) {
  window.chapters = {}
}
var sheets = $('.sheet.pre-paginated')

for (let i = 0; i<sheets.length; i++) {
  var sheet = sheets[i]
  const id = $(sheet).attr('id')
  var img = $(sheet).find('iframe').contents().find('div img')
  var content = $(sheet).find('iframe').contents().find('div').text()
  if (img.length) {
    console.log(id, img[0].src, content)
  }
  window.chapters[id] = {
    src: img[0].src,
    content
  }
}

$('body').empty()
for (let key in window.chapters) {
  var info = window.chapters[key]
  $('body').append('<img src="' + info.src + '">')
  $('body').append('<div>' + info.content +
    '</div>')
}