export default [{
  name: '矩形',
  style: {
    background: 'var(--bg)'
  },
  variables: [{
    name: 'bg',
    value: 'rgba(148,187,233,1)',
    type: 'gradient'
  }]
}, {
  name: '圆形',
  style: {
    borderRadius: '50%',
    background: 'var(--bg)'
  },
  variables: [{
    name: 'bg',
    value: 'rgba(148,187,233,1)',
    type: 'gradient'
  }]
}, {
  name: '空心圆',
  style: {
    borderRadius: '50%',
    background: 'transparent',
    borderWidth: 'var(--bw)',
    borderColor: 'var(--bc)',
    borderStyle: 'solid',
    boxSizing: 'border-box'
  },
  variables: [{
    name: 'bw',
    value: 3,
    type: 'px'
  }, {
    name: 'bc',
    value: '#980',
    type: 'color'
  }]
}, {
  name: '圆角矩形',
  style: {
    background: 'var(--bg)',
    borderRadius: 'var(--br)'
  },
  variables: [{
    name: 'bg',
    label: '背景颜色',
    value: 'rgba(148,187,233,1)',
    type: 'gradient'
  }, {
    name: 'br',
    label: '',
    value: 5,
    type: 'px'
  }]
}, {
  name: '空心矩形',
  style: {
    background: 'transparent',
    border: 'var(--bw) solid var(--bc)'
  },
  variables: [{
    name: 'bc',
    label: '颜色',
    value: 'rgba(148,187,233,1)',
    type: 'color'
  }, {
    name: 'bw',
    label: '',
    value: 3,
    type: 'px'
  }]
}, {
  name: '对称线',
  style: {
    background: 'transparent',
    borderTop: 'var(--bw) solid var(--bc)',
    borderBottom: 'var(--bw) solid var(--bc)'
  },
  variables: [{
    name: 'bc',
    label: '颜色',
    value: 'rgba(148,187,233,1)',
    type: 'color'
  }, {
    name: 'bw',
    label: '',
    value: 3,
    type: 'px'
  }]
}, {
  name: '折线',
  style: {
    background: 'transparent',
    borderTop: 'var(--bw) solid var(--bc)',
    borderLeft: 'var(--bw) solid var(--bc)'
  },
  variables: [{
    name: 'bc',
    label: '颜色',
    value: 'rgba(148,187,233,1)',
    type: 'color'
  }, {
    name: 'bw',
    label: '',
    value: 3,
    type: 'px'
  }]
}, {
  name: '芒果形',
  style: {
    borderTopLeftRadius: 'var(--r)',
    borderBottomRightRadius: 'var(--r)',
    background: 'var(--bg)'
  },
  variables: [{
    name: 'r',
    value: 50,
    type: 'percent'
  }, {
    name: 'bg',
    value: 'rgba(148,187,233,1)',
    type: 'gradient'
  }]
}, {
  name: '芒果形',
  style: {
    borderTopRightRadius: 'var(--r)',
    borderBottomLeftRadius: 'var(--r)',
    background: 'var(--bg)'
  },
  variables: [{
    name: 'r',
    value: 50,
    type: 'percent'
  }, {
    name: 'bg',
    value: 'rgba(148,187,233,1)',
    type: 'gradient'
  }]
}]
