
const fontStyles = {
  fontSize: 'var(--fontSize)',
  color: 'var(--color)',
  textAlign: 'var(--textAlign)',
  fontFamily: 'var(--fontFamily)',
  fontWeight: 'var(--fontWeight)'
}
export const fontTemplates = [{
  text: '添加标题',
  style: fontStyles,
  variables: [{
    name: 'fontFamily',
    value: '微软雅黑',
    type: 'fontFamily'
  }, {
    name: 'fontSize',
    value: 48,
    type: 'fontSize'
  }, {
    name: 'color',
    value: '#444',
    type: 'color'
  }, {
    name: 'textAlign',
    value: 'center',
    type: 'textAlign'
  }, {
    name: 'fontWeight',
    value: 800,
    type: 'fontWeight'
  }]
}, {
  text: '添加子标题',
  style: fontStyles,
  variables: [{
    name: 'fontFamily',
    value: '微软雅黑',
    type: 'fontFamily'
  }, {
    name: 'fontSize',
    value: 36,
    type: 'fontSize'
  }, {
    name: 'color',
    value: '#333',
    type: 'color'
  }, {
    name: 'textAlign',
    value: 'center',
    type: 'textAlign'
  }, {
    name: 'fontWeight',
    value: 400,
    type: 'fontWeight'
  }]
}, {
  text: '添加正文',
  style: fontStyles,
  variables: [{
    name: 'fontFamily',
    value: '微软雅黑',
    type: 'fontFamily'
  }, {
    name: 'fontSize',
    value: 24,
    type: 'fontSize'
  }, {
    name: 'color',
    value: '#333',
    type: 'color'
  }, {
    name: 'textAlign',
    value: 'left',
    type: 'textAlign'
  }, {
    name: 'fontWeight',
    value: 200,
    type: 'fontWeight'
  }]
}]
