if (!window.chapters) {
  window.chapters = {}
}
var sheets = $('.sheet.pre-paginated')

for (let i = 0; i<sheets.length; i++) {
  var sheet = sheets[i]
  const id = $(sheet).attr('id')
  // var img = $(sheet).find('iframe').contents().find('div img')
  var img = $(sheet).find('iframe').contents().find('div.background_image')
  var content = $(sheet).find('iframe').contents().find('div').text()
  window.chapters[id] = {
    src: img.css('background-image'),
    content
  }
}

$('body').empty()
$('head').empty()
for (let key in window.chapters) {
  var info = window.chapters[key]
  let div = $('<img/>')
  div.attr('src', info.src.replace('url("', '').replace('")', ''))
  // div.css('background-image', info.src)
  div.css('height', 120)
  div.css('width', 120)
  $('body').append(div)
  $('body').append('<div>' + info.content +
    '</div>')
}