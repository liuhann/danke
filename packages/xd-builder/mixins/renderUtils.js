/**
 * 设置样式变量具体值
 * @param style 目标样式对象
 * @param variables 变量定义
 * @param valueFrom 获取变量的Key
 */
export function assignVariables (style, variables, valueFrom) {
  let key = valueFrom || 'value'
  if (variables && variables.length) {
    for (let variable of variables) {
      if (variable.type === 'px' || variable.type === 'fontSize') {
        Object.assign(style, {
          ['--' + variable.name]: variable[key] + 'px'
        })
      } else if (variable.type === 'percent') {
        Object.assign(style, {
          ['--' + variable.name]: variable[key] + '%'
        })
      } else {
        Object.assign(style, {
          ['--' + variable.name]: variable[key]
        })
      }
    }
  }
}
