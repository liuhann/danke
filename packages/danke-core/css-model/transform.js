export default {
  translate: ['0', '0', '0'],
  scale: 100,
  opacity: 100,
  psp: '1000',
  rotate: ['0', '0', '0']
}

export function getTransformStyle ({ transform }) {
  const styles = []
  if (transform) {
    const transforms = []
    if (transform.psp) {
      transforms.push(`perspective(${transform.psp}px)`)
    }
    if (transform.translate) {
      transforms.push(`translate3d(${transform.translate[0]}%, ${transform.translate[1]}%, ${transform.translate[2]}px)`)
    }
    if (transform.rotate) {
      transforms.push(`rotateX(${transform.rotate[0]}deg)`)
      transforms.push(`rotateY(${transform.rotate[1]}deg)`)
      transforms.push(`rotateZ(${transform.rotate[2]}deg)`)
    }
    if (transform.scale) {
      transforms.push(`scale(${transform.scale / 100})`)
    }
    styles.push(`transform: ${transforms.join(' ')}`)
    if (transform.opacity != null) {
      styles.push(`opacity: ${transform.opacity / 100}`)
    }
  }
  return styles
}
