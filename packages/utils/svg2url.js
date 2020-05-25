function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function svg2url (raw) {
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

export {
  svg2url
}
