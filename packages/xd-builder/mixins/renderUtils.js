/**
 * 设置样式变量具体值
 * @param style 目标样式对象
 * @param variables 变量定义
 * @param valueFrom 获取变量的Key
 * @param scale 缩放
 */
function assignVariables (style, variables, valueFrom, scale) {
  Object.assign(style, getVariableStyle(variables, valueFrom, scale))
}

function getVariableStyle (variables, valueFrom, scale) {
  const style = {}
  let key = valueFrom || 'value'
  let pxScale = scale || 1
  if (variables && variables.length) {
    for (let variable of variables) {
      if (variable.type === 'fontSize') {
        Object.assign(style, {
          ['--' + variable.name]: (variable[key] * pxScale) + 'px'
        })
      } else if (variable.type === 'px' || variable.type === 'lineHeight' || variable.type === 'letterSpacing') {
        Object.assign(style, {
          ['--' + variable.name]: (variable[key] * pxScale) + 'px'
        })
      } else if (variable.type === 'percent') {
        Object.assign(style, {
          ['--' + variable.name]: variable[key] + '%'
        })
      } else if (variable.type === 'deg') {
        Object.assign(style, {
          ['--' + variable.name]: variable[key] + 'deg'
        })
      } else {
        Object.assign(style, {
          ['--' + variable.name]: variable[key]
        })
      }
    }
  }
  return style
}

export {
  assignVariables,
  getVariableStyle
}
