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
    if (transform.psp) {
      styles.push(`perspective(${transform.psp}px)`)
    }
    if (transform) {
      if (transform.translate) {
        styles.push(`translate3d(${transform.translate[0]}%, ${transform.translate[1]}%, ${transform.translate[2]}px)`)
      }
      if (transform.rotate) {
        styles.push(`rotateX(${transform.rotate[0]}deg)`)
        styles.push(`rotateY(${transform.rotate[1]}deg)`)
        styles.push(`rotateZ(${transform.rotate[2]}deg)`)
      }
    }
    if (transform.scale) {
      styles.push(`scale(${transform.scale / 100})`)
    }
  }
  return [`transform: ${styles.join(' ')}`]
}
