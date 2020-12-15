/**
 * 设置样式变量具体值
 * @param style 目标样式对象
 * @param variables 变量定义
 * @param valueFrom 获取变量的Key
 */
function assignVariables (style, variables, valueFrom) {
  Object.assign(style, getVariableStyle(variables, valueFrom))
}

function getVariableStyle (variables, valueFrom) {
  const style = {}
  let key = valueFrom || 'value'
  if (variables && variables.length) {
    for (let variable of variables) {
      if (variable.type === 'fontSize') {
        Object.assign(style, {
          ['--' + variable.name]: variable[key] + 'px'
        })
      } else if (variable.type === 'px') {
        Object.assign(style, {
          ['--' + variable.name]: variable[key] + 'px'
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
