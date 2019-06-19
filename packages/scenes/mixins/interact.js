import interact from 'interactjs'

function ineractElement (element) {
  interact('.ti').draggable({
    onmove: this.dragMoveListener
  })
}

function dragElementMoveListener (event) {
    let target = event.target
    console.log(target)
    target = target.parentElement
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
    // translate the element
    target.style.webkitTransform =
      target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)'
    
    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
  }
}