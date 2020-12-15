const fontStyles = {
  fontSize: 'var(--fontSize)',
  color: 'var(--color)',
  fontFamily: 'var(--fontFamily)',
  fontWeight: 'var(--fontWeight)',
  letterSpacing: 'var(--letterSpacing)'
}

const text = {
  text: '添加标题',
  style: fontStyles,
  variables: [{
    name: 'fontFamily',
    value: '微软雅黑',
    type: 'fontFamily'
  }, {
    name: 'fontSize',
    value: 32,
    type: 'fontSize'
  }, {
    name: 'color',
    value: '#444',
    type: 'color'
  }, {
    name: 'fontWeight',
    value: 200,
    type: 'fontWeight'
  }, {
    name: 'letterSpacing',
    value: 2,
    type: 'px'
  }]
}

export {
  fontStyles,
  text
}
