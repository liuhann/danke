import interact from 'interactjs'

function interactElement (element, model, device) {
  interact(element).draggable({
    onmove: event => {
      let target = event.target
      const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
      // translate the element
      // update the posiion attributes
      target.setAttribute('data-x', x)
      target.setAttribute('data-y', y)
    }
  })
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
