function hexToRgba (hexValue) {
  const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  const hex = hexValue.replace(rgx, (m, r, g, b) => r + r + g + g + b + b)
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  const r = parseInt(rgb[1], 16)
  const g = parseInt(rgb[2], 16)
  const b = parseInt(rgb[3], 16)
  return {
    r,
    g,
    b
  }
}
export default {
  hexToRgba
}
