import interact from 'interactjs'

function ineractElement (element, model, device) {
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

function intereactWith (element, withElement) {
  interact(element).draggable({
    onmove: function (event) {
      let target = event.target
      const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
      // translate the element
      withElement.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
      // update the posiion attributes
      target.setAttribute('data-x', x)
      target.setAttribute('data-y', y)
    }
  }).styleCursor(false)
}

export {
  ineractElement,
  intereactWith
}
