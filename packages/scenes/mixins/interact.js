import interact from 'interactjs'
import { getLenSplits } from '../../utils/position'

function interactElement (element, model, vm) {
  interact(element).draggable({
    onmove: event => {
      event.target.style.top = (parseFloat(event.target.style.top) + event.dy) + 'px'
      event.target.style.left = (parseFloat(event.target.style.left) + event.dx) + 'px'
      // model.position.offsetX = increaseOffsetWithPixel(model.position.offsetX, event.dx, vm.device)
      // model.position.offsetY = increaseOffsetWithPixel(model.position.offsetY, event.dy, vm.device)
    },
    onend: event => {
    }
  })
}

function increaseOffsetWithPixel (offset, pixel, device) {
  console.log(offset, pixel, device)
  const original = getLenSplits(offset)
  if (original.unit === 'px') {
    return (original.len + pixel) + 'px'
  } else if (original.unit === 'vw') {
    return Math.floor((original.len + (pixel / device.width * 100))) + 'vw'
  } else {
    return (original.len + (pixel / device.height * 100)).toFixed(2) + 'vh'
  }
}

function getElementTranslates (el) {
  try {
    const str = el.style.transform
    if (!str) {
      return [0, 0, 0]
    }
    const replaces = str.replace(/translate|[()]|[px]|\s/g, '')
    return replaces.split(',')
  } catch (e) {
    return [0, 0, 0]
  }
}

function intereactWith (element, withElement) {
  interact(element).draggable({
    onmove: function (event) {
      const targetTranslates = getElementTranslates(withElement)
      console.log(targetTranslates)
      const x = parseInt(targetTranslates[0]) + event.dx
      const y = parseInt(targetTranslates[1]) + event.dy
      // translate the element
      withElement.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    }
  }).styleCursor(false)
}

export {
  interactElement,
  intereactWith
}
