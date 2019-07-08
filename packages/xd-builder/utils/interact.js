import interact from 'interactjs'
import { getLenSplits } from '../../danke-core/utils/common'

function interactElement (element, model, vm) {
  interact(element).draggable({
    onmove: event => {
      model.position.offsetX = increaseOffsetWithPixel(model.position.offsetX,
        model.position.horizontal !== 'right' ? event.dx : -event.dx, vm.device)
      model.position.offsetY = increaseOffsetWithPixel(model.position.offsetY,
        model.position.vertical !== 'bottom' ? event.dy : -event.dy, vm.device)
    },
    onend: event => {
    }
  }).resizable({
    // resize from all edges and corners
    edges: { left: false, right: true, bottom: true, top: false },
    modifiers: [
      // keep the edges inside the parent
      interact.modifiers.restrictEdges({
        outer: 'parent',
        endOnly: true
      })
    ],
    inertia: true
  }).on('resizemove', function (event) {
    model.size.width = increaseOffsetWithPixel(model.size.width, event.dx, vm.device)
    model.size.height = increaseOffsetWithPixel(model.size.height, event.dy, vm.device)
  }).styleCursor(false)
}

function destoryInteraction (element) {
  interact(element).unset()
}

function increaseOffsetWithPixel (offset, pixel, device) {
  const original = getLenSplits(offset)
  if (original.unit === 'px') {
    return (original.len + pixel) + 'px'
  } else if (original.unit === 'vw') {
    return (original.len + (pixel / device.width * 100)).toFixed(2) + 'vw'
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
      const x = parseInt(targetTranslates[0]) + event.dx
      const y = parseInt(targetTranslates[1]) + event.dy
      // translate the element
      withElement.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    }
  }).styleCursor(false)
}

export {
  interactElement,
  destoryInteraction,
  intereactWith
}
