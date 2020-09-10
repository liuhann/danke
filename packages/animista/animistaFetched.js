import './animista.css'
import animista from './animista'

function getRoots () {
  return Object.keys(animista.categories)
}

function getSubGroup (root) {
  return Object.keys(animista.categories[root].groups)
}

function getGroupAnimations (root, group) {
  return animista.categories[root].groups[group].variations
}

export {
  getRoots,
  getSubGroup,
  getGroupAnimations
}
