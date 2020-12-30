const fontStyles = {
  fontSize: 'var(--fontSize)',
  color: 'var(--color)',
  fontFamily: 'var(--fontFamily)',
  fontWeight: 'var(--fw)',
  lineHeight: 'var(--lh)',
  letterSpacing: 'var(--ls)'
}

const text = {
  text: '添加文本',
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
    name: 'fw',
    value: 200,
    type: 'fontWeight'
  }, {
    name: 'ls',
    value: 2,
    type: 'letterSpacing'
  }, {
    name: 'lh',
    value: 32,
    type: 'lineHeight'
  }]
}

export {
  fontStyles,
  text
}
