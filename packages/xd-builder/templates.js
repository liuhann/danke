const fontStyles = {
  fontSize: 'var(--fontSize)',
  color: 'var(--color)',
  fontFamily: 'var(--fontFamily)',
  fontWeight: 'var(--fw)',
  lineHeight: 'var(--lh)',
  letterSpacing: 'var(--ls)'
}

const text = {
  text: '文字（小）',
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

const title = {
  text: '文字（大）',
  style: fontStyles,
  variables: [{
    name: 'fontFamily',
    value: '微软雅黑',
    type: 'fontFamily'
  }, {
    name: 'fontSize',
    value: 64,
    type: 'fontSize'
  }, {
    name: 'color',
    value: '#444',
    type: 'color'
  }, {
    name: 'fw',
    value: 800,
    type: 'fontWeight'
  }, {
    name: 'ls',
    value: 2,
    type: 'letterSpacing'
  }, {
    name: 'lh',
    value: 72,
    type: 'lineHeight'
  }]
}

const title2 = {
  text: '文字（中）',
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
    name: 'fw',
    value: 400,
    type: 'fontWeight'
  }, {
    name: 'ls',
    value: 2,
    type: 'letterSpacing'
  }, {
    name: 'lh',
    value: 52,
    type: 'lineHeight'
  }]
}

const rect = {
  name: '实心矩形',
  style: {
    background: 'var(--bg)'
  },
  variables: [{
    name: 'bg',
    value: 'rgba(148,187,233,1)',
    type: 'color'
  }]
}

const circle = {
  name: '圆形',
  style: {
    borderRadius: '50%',
    background: 'var(--bg)'
  },
  variables: [{
    name: 'bg',
    value: 'rgba(148,187,233,1)',
    type: 'color'
  }]
}


const hollowCircle = {
  name: '空心圆',
  style: {
    borderRadius: '50%',
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
}
const hollowRect = {
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
}

const radiusRect = {
  name: '圆角矩形',
  style: {
    background: 'transparent',
    borderRadius: 'var(--br)',
    border: 'var(--bw) solid var(--bc)'
  },
  variables: [{
    name: 'bc',
    value: 'rgba(148,187,233,1)',
    type: 'color'
  }, {
    name: 'bw',
    value: 3,
    type: 'px'
  }, {
    name: 'br',
    value: 10,
    type: 'px'
  }]
}

export {
  text,
  title,
  title2,
  rect,
  circle,
  hollowCircle,
  hollowRect,
  radiusRect
}
