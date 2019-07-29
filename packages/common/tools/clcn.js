var sheets = $('.sheets.pre-paginated')

for (let sheet of sheets) {
  const id = $(sheet).attr('id')
  var img = $(sheet.find('iframe').contentWindow).find('body>div img')
  console.log(img)
}
