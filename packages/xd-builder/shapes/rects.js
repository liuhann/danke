export default [{
  name: '矩形',
  style: {
    border: 'var(--bw) solid var(--bc)',
    background: 'var(--bg)'
  },
  variables: [{
    name: 'bg',
    value: 'transparent',
    type: 'gradient'
  }, {
    name: 'bw',
    label: '边框宽度',
    value: 1,
    type: 'px'
  }, {
    name: 'bc',
    label: '边框',
    value: '#999',
    type: 'color'
  }]
}, {
  name: '圆形',
  style: {
    border: 'var(--width) solid var(--color)',
    borderRadius: '50%',
    background: 'var(--bg)'
  },
  variables: [{
    name: 'bg',
    value: 'rgba(148,187,233,1)',
    type: 'gradient'
  }, {
    name: 'width',
    value: 1,
    type: 'px'
  }, {
    name: 'color',
    value: '#999',
    type: 'color'
  }]
}, {
  name: '圆角矩形',
  width: 100,
  height: 100,
  style: {
    background: 'var(--bgc)',
    border: 'var(--bw) solid var(--bc)',
    borderRadius: 'var(--br)'
  },
  variables: [{
    name: 'bgc',
    label: '背景颜色',
    value: 'transparent',
    type: 'gradient'
  }, {
    name: 'br',
    label: '',
    value: 5,
    type: 'px'
  }, {
    name: 'bw',
    label: '边框宽度',
    value: 1,
    type: 'px'
  }, {
    name: 'bc',
    label: '边框',
    value: '#999',
    type: 'color'
  }]
}, {
  width: 100,
  height: 100,
  maskable: true,
  style: {
    border: 'var(--bw) solid var(--bc)',
    borderTopLeftRadius: 'var(--r)',
    borderBottomRightRadius: 'var(--r)',
    overflow: 'hidden',
    background: 'var(--bg)'
  },
  variables: [{
    name: 'r',
    value: 50,
    type: 'percent'
  }, {
    name: 'bg',
    value: 'transparent',
    type: 'gradient'
  }, {
    name: 'bw',
    label: '边框宽度',
    value: 1,
    type: 'px'
  }, {
    name: 'bc',
    label: '边框',
    value: '#999',
    type: 'color'
  }]
}, {
  width: 100,
  height: 100,
  maskable: true,
  style: {
    border: 'var(--bw) solid var(--bc)',
    borderTopRightRadius: 'var(--r)',
    borderBottomLeftRadius: 'var(--r)',
    overflow: 'hidden',
    background: 'var(--bg)'
  },
  variables: [{
    name: 'r',
    value: 50,
    type: 'percent'
  }, {
    name: 'bg',
    value: 'transparent',
    type: 'gradient'
  }, {
    name: 'bw',
    label: '边框宽度',
    value: 1,
    type: 'px'
  }, {
    name: 'bc',
    label: '边框',
    value: '#999',
    type: 'color'
  }]
}, {
  width: 100,
  height: 100,
  maskable: true,
  style: {
    border: 'var(--bw) solid var(--bc)',
    borderTopRightRadius: 'var(--r)',
    borderTopLeftRadius: 'var(--r)',
    overflow: 'hidden',
    background: 'var(--bg)'
  },
  variables: [{
    name: 'r',
    value: 40,
    type: 'percent'
  }, {
    name: 'bg',
    value: 'transparent',
    type: 'gradient'
  }, {
    name: 'bw',
    label: '边框宽度',
    value: 1,
    type: 'px'
  }, {
    name: 'bc',
    label: '边框',
    value: '#999',
    type: 'color'
  }]
}, {
  width: 100,
  height: 100,
  maskable: true,
  style: {
    border: 'var(--bw) solid var(--bc)',
    borderBottomRightRadius: 'var(--r)',
    borderBottomLeftRadius: 'var(--r)',
    overflow: 'hidden',
    background: 'var(--bg)'
  },
  variables: [{
    name: 'r',
    value: 40,
    type: 'percent'
  }, {
    name: 'bg',
    value: 'transparent',
    type: 'gradient'
  }, {
    name: 'bw',
    label: '边框宽度',
    value: 1,
    type: 'px'
  }, {
    name: 'bc',
    label: '边框',
    value: '#999',
    type: 'color'
  }]
}]
