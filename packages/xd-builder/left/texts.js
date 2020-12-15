
import { fontStyles } from '../templates'

export const fontTemplates = [{
  text: '添加标题',
  style: fontStyles,
  size: 0.1,
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
    value: '#444',
    type: 'color'
  }, {
    name: 'fontWeight',
    value: 'bold',
    type: 'fontWeight'
  }, {
    name: 'letterSpacing',
    value: 8,
    type: 'px'
  }]
}, {
  text: '添加子标题',
  style: fontStyles,
  size: 0.05,
  variables: [{
    name: 'fontFamily',
    value: '微软雅黑',
    type: 'fontFamily'
  }, {
    name: 'fontSize',
    value: 20,
    type: 'fontSize'
  }, {
    name: 'color',
    value: '#333',
    type: 'color'
  }, {
    name: 'fontWeight',
    value: 'normal',
    type: 'fontWeight'
  }, {
    name: 'letterSpacing',
    value: 6,
    type: 'px'
  }]
}, {
  text: '添加正文',
  style: fontStyles,
  size: 0.03,
  variables: [{
    name: 'fontFamily',
    value: '微软雅黑',
    type: 'fontFamily'
  }, {
    name: 'fontSize',
    value: 16,
    type: 'fontSize'
  }, {
    name: 'color',
    value: '#333',
    type: 'color'
  }, {
    name: 'fontWeight',
    value: 'normal',
    type: 'fontWeight'
  }, {
    name: 'letterSpacing',
    value: 4,
    type: 'px'
  }]
}, {
  text: 'Neon文字效果',
  style: Object.assign(fontStyles, {
    textShadow: `0 0 5px var(--color), 0 0 10px var(--color), 0 0 20px var(--color),0 0 40px var(--shadow),0 0 80px var(--shadow),0 0 90px var(--shadow),0 0 100px var(--shadow),0 0 150px var(--shadow)`
  }),
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
    value: '#fff',
    type: 'color'
  }, {
    name: 'shadow',
    value: '#0ff',
    type: 'color'
  }, {
    name: 'textAlign',
    value: 'left',
    type: 'textAlign'
  }, {
    name: 'fontWeight',
    value: 200,
    type: 'fontWeight'
  }, {
    name: 'letterSpacing',
    value: 10,
    type: 'px'
  }]
}]
