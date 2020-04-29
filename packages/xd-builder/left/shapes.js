export default [{
  name: '矩形',
  width: 100,
  height: 100,
  style: {
    background: 'var(--backgroundColor)'
  },
  variables: [{
    name: 'backgroundColor',
    label: '背景颜色',
    value: 'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(34,193,195,1) 100%)',
    type: 'gradient'
  }]
}, {
  name: '圆形',
  width: 100,
  height: 100,
  style: {
    background: 'var(--backgroundColor)',
    borderRadius: '50%',
  },
  variables: [{
    name: 'backgroundColor',
    label: '背景颜色',
    value: '#ED6430',
    type: 'color'
  }]
}, {
  name: '半圆',
  width: 50,
  height: 100,
  maskable: true,
  style: {
    clipPath: 'ellipse(100% 50% at 100% 50%)',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'bgColor',
    value: '#00bf72',
    type: 'color'
  }]
}, {
  name: '带边框矩形',
  width: 100,
  height: 100,
  style: {
    border: 'var(--borderWidth) solid var(--borderColor)',
    background: 'var(--backgroundColor)'
  },
  variables: [{
    name: 'backgroundColor',
    label: '背景颜色',
    value: '#95CFD0',
    type: 'color'
  }, {
    name: 'borderWidth',
    label: '边框宽度',
    value: 4,
    type: 'px'
  }, {
    name: 'borderColor',
    label: '背景颜色',
    value: '#FFF',
    type: 'color'
  }]
}, {
  name: '边框圆形',
    width: 100,
    height: 100,
    style: {
      background: 'var(--backgroundColor)',
      border: 'var(--borderWidth) solid var(--borderColor)',
      borderRadius: '50%',
    },
    variables: [{
      name: 'backgroundColor',
      label: '背景颜色',
      value: '#F9DD99',
      type: 'color'
    }, {
      name: 'borderWidth',
      label: '边框宽度',
      value: 4,
      type: 'px'
    }, {
      name: 'borderColor',
      label: '背景颜色',
      value: '#FFF',
      type: 'color'
    }]
},{
  name: '边框圆角矩形',
  width: 100,
  height: 100,
  style: {
    border: 'var(--borderWidth) solid var(--borderColor)',
    borderRadius: 'var(--radius)',
    background: 'var(--backgroundColor)'
  },
  variables: [{
    name: 'backgroundColor',
    label: '背景颜色',
    value: '#D1E395',
    type: 'color'
  }, {
    name: 'borderWidth',
    label: '边框宽度',
    value: 4,
    type: 'px'
  }, {
    name: 'borderColor',
    label: '背景颜色',
    value: '#FFF',
    type: 'color'
  }, {
    name: 'radius',
    value: 15,
    type: 'percent'
  },]
}, {
  name: '三角形',
  width: 100,
  height: 100,
  maskable: true,
  style: {
    clipPath: 'polygon(var(--position) 0, 0% 100%, 100% 100%)',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'position',
    value: 50,
    type: 'percent'
  }, {
    label: '背景颜色',
    name: 'bgColor',
    value: '#F29FA8',
    type: 'color'
  }]
}, {
  name: '平行四边形',
  width: 100,
  height: 80,
  maskable: true,
  style: {
    clipPath: 'polygon(var(--position) 0%, 100% 0%, calc(100% - var(--position)) 100%, 0% 100%)',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'position',
    value: 25,
    type: 'percent'
  }, {
    label: '背景颜色',
    name: 'bgColor',
    value: '#D1E395',
    type: 'color'
  }]
}, {
  name: '菱形',
  width: 100,
  height: 100,
  maskable: true,
  style: {
    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    label: '背景颜色',
    name: 'bgColor',
    value: '#D1E395',
    type: 'color'
  }]
}, {
  width: 100,
  height: 100,
  maskable: true,
  style: {
    clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'bgColor',
    value: '#00bf72',
    type: 'color'
  }]
}, {
  width: 100,
  height: 100,
  maskable: true,
  style: {
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'bgColor',
    value: '#00bf72',
    type: 'color'
  }]
}, {
  width: 100,
  height: 100,
  maskable: true,
  style: {
    clipPath: 'polygon(100% 0%, calc(100% - var(--position)) 50%, 100% 100%, var(--position) 100%, 0% 50%, var(--position) 0%)',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'position',
    value: 25,
    type: 'percent'
  }, {
    name: 'bgColor',
    value: '#00bf72',
    type: 'color'
  }]
}, {
  width: 100,
  height: 100,
  maskable: true,
  style: {
    clipPath: 'polygon(calc(100% - var(--position)) 0%, 100% 50%, calc(100% - var(--position)) 100%, 0% 100%, var(--position) 50%, 0% 0%)',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'position',
    value: 25,
    type: 'percent'
  }, {
    name: 'bgColor',
    value: '#00bf72',
    type: 'color'
  }]
}, {
  name: '尖边矩形',
  width: 100,
  height: 100,
  maskable: true,
  style: {
    clipPath: 'polygon(0 0, 100% 0, 100% var(--position), 50% 100%, 0 var(--position))',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'bgColor',
    value: '#00bf72',
    type: 'color'
  }, {
    name: 'position',
    value: 75,
    type: 'percent'
  }, ]
}, {
  name: '凹边矩形',
  width: 100,
  height: 100,
  maskable: true,
  style: {
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% var(--position), 0 100%)',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'bgColor',
    value: '#00bf72',
    type: 'color'
  }, {
    name: 'position',
    value: 75,
    type: 'percent'
  }, ]
}, {
  name: '斜角矩形',
  width: 100,
  height: 100,
  maskable: true,
  style: {
    clipPath: 'polygon(var(--position) 0%, calc(100% - var(--position)) 0%, 100% var(--position), 100% calc(100% - var(--position)), calc(100% - var(--position)) 100%, var(--position) 100%, 0% calc(100% - var(--position)), 0% var(--position))',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'bgColor',
    value: '#00bf72',
    type: 'color'
  }, {
    name: 'position',
    value: 20,
    type: 'percent'
  }, ]
}, {
  width: 100,
  height: 100,
  maskable: true,
  style: {
    clipPath: 'ellipse(var(--r1) var(--r2) at var(--c1) var(--c2))',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'r1',
    value: 50,
    type: 'percent'
  }, {
    name: 'r2',
    value: 40,
    type: 'percent'
  }, {
    name: 'c1',
    value: 50,
    type: 'percent'
  },{
    name: 'c2',
    value: 50,
    type: 'percent'
  }, {
    name: 'bgColor',
    value: '#00bf72',
    type: 'color'
  }]
}, {
  width: 100,
  height: 100,
  maskable: true,
  style: {
    borderTopLeftRadius: 'var(--radius)',
    borderBottomRightRadius: 'var(--radius)',
    overflow: 'hidden',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'radius',
    value: 50,
    type: 'percent'
  }, {
    name: 'bgColor',
    value: '#00bf72',
    type: 'color'
  }]
}, {
  width: 100,
  height: 100,
  maskable: true,
  style: {
    borderTopLeftRadius: 'var(--radius)',
    borderBottomLeftRadius: 'var(--radius)',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'radius',
    value: 50,
    type: 'percent'
  }, {
    name: 'bgColor',
    value: '#00bf72',
    type: 'color'
  }]
}, {
  width: 100,
  height: 100,
  maskable: true,
  style: {
    borderTopRightRadius: 'var(--radius)',
    borderBottomLeftRadius: 'var(--radius)',
    overflow: 'hidden',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'radius',
    value: 50,
    type: 'percent'
  }, {
    name: 'bgColor',
    value: '#00bf72',
    type: 'color'
  }]
},{
  width: 100,
  height: 100,
  maskable: true,
  style: {
    borderRadius: 'var(--radius)',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'radius',
    value: 20,
    type: 'percent'
  }, {
    name: 'bgColor',
    value: '#00bf72',
    type: 'color'
  }]
}]