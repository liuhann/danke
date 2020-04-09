export function assignVariables (style, variables) {
  if (variables && variables.length) {
    for (let variable of variables) {
      if (variable.type === 'px' || variable.type === 'fontSize') {
        Object.assign(style, {
          ['--' + variable.name]: variable.value + 'px'
        })
      } else if (variable.type === 'percent'){
        Object.assign(style, {
          ['--' + variable.name]: variable.value + '%'
        })
      } else {
        Object.assign(style, {
          ['--' + variable.name]: variable.value
        })
      }
    }
  }
}

