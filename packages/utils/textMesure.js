export default function (text, fontSize, fontWeight) {
  let test = document.getElementById("textMesure")
  if (!test) {
    test = document.createElement("div")
    test.id = "textMesure"
    text.style.posiiton = 'absolute'
    text.style.visibility = 'hidden'
    test.style.width = 'auto'
    test.style.height = 'auto'
    test.style.whiteSpace = 'nowrap'
    document.body.append(test)
  }
  test.style.fontSize = fontSize + 'px'
  test.style.fontWeight = fontWeight
  test.innerHTML = text
  return {
    width: test.clientWidth + 10,
    height: test.clientHeight + 1
  }
}