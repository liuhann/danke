import { fitRectIntoBounds } from '../mixins/rectUtils.js'

function fitToCenter (workSpace, viewBox, padding) {
  // 上下左右边距30px  自适应到容器大小
  const fitSize = fitRectIntoBounds(viewBox, {
    width: workSpace.width - padding * 2,
    height: workSpace.height - padding * 2
  })
  const result = {}
  // 自适应后，伸缩的比率
  result.scale = fitSize.width / viewBox.width
  
  if (!fitSize.fitTo == null) {
    
  } else if (fitSize.fitTo === 'width') {
    result.translateX = padding
    result.translateY = (workSpace.height - fitSize.height) / 2
  } else {
    result.translateX = (workSpace.width - fitSize.width) / 2
    result.translateY = padding
  }
  return result;
  // this.$emit('scale-fit', this.scale)
}

export { fitToCenter }