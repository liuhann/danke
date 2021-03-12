function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function svg (raw) {
  let encoded = raw.replace(/\s+/g, " ")

  // According to Taylor Hunt, lowercase gzips better ... my tiny test confirms this
  encoded = replaceAll(encoded, "%", "%25");
  encoded = replaceAll(encoded, "> <", "><"); // normalise spaces elements
  encoded = replaceAll(encoded, "; }", ";}"); // normalise spaces css
  encoded = replaceAll(encoded, "<", "%3c");
  encoded = replaceAll(encoded, ">", "%3e");
  encoded = replaceAll(encoded, "\"", "'");
  encoded = replaceAll(encoded, "#", "%23"); // needed for ie and firefox
  encoded = replaceAll(encoded, "{", "%7b");
  encoded = replaceAll(encoded, "}", "%7d");
  encoded = replaceAll(encoded, "|", "%7c");
  encoded = replaceAll(encoded, "^", "%5e");
  encoded = replaceAll(encoded, "`", "%60");
  encoded = replaceAll(encoded, "@", "%40");

  // charset reportedly not needed ... I need to test before implementing
  let uri = 'url("data:image/svg+xml;charset=UTF-8,' + encoded + '")';

  return uri
}

function getColorVariables (svg) {
  let rgbRegex = /[rR][gG][Bb][Aa]?[\\(]((2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?(0\\.\\d{1,2}|1|0)?[\\)]{1}/g
  let colorRegex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})|rgb[a]?\([^)]+\)/g
  const colorMatched = svg.match(colorRegex);
  const colorList = Array.from(new Set(colorMatched))
  const variables = []
  for (let i = 0; i < colorList.length; i++) {
    variables.push({
      'name': 'c' + i,
      'value': colorList[i],
      'label': '颜色',
      'type': 'color'
    })
    svg = svg.replace(new RegExp(colorList[i].replace('(', '\\(').replace(')', '\\)'), 'gm'), `var(--c${i})`)
  }
  if (variables.length === 0) {
    svg = svg.replace('<svg', `<svg fill="var(--color)" `)
    variables.push({
      'name': 'color',
      'value': '#444',
      'label': '颜色',
      'type': 'color'
    })
  }
  return {
    svg,
    variables
  }
}

export {
  svg,
  getColorVariables
}
