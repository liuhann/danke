export default [{
  name: '带边框矩形',
  style: {
    background: 'var(--backgroundColor)',
    borderColor: 'var(--borderColor)',
    borderRadius: 'var(--borderRadius)',
    borderWidth: 'var(--borderWidth)',
  },
  variables: [{
    name: 'borderColor',
    label: '边框颜色',
    value: '#00bf72',
    type: 'color'
  }, {
    name: 'backgroundColor',
    label: '背景颜色',
    value: '#10211a',
    type: 'color'
  }, {
    name: 'borderWidth',
    label: '边框宽度',
    value: 2,
    type: 'px'
  }, {
    name: 'borderRadius',
    label: '圆角',
    value: 0,
    type: 'px'
  }]
}, {
  name: '文本框',
  width: 48,
  height: 48,
  text: '文本框',
  style: {
    background: 'var(--backgroundColor)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 'var(--fontSize)',
    color: 'var(--fontColor)'
  },
  variables: [{
    label: '背景颜色',
    name: 'backgroundColor',
    value: '#00bf72',
    type: 'color'
  }, {
    label: '文字大小',
    name: 'fontSize',
    value: 22,
    type: 'fontSize'
  }, {
    label: '文字颜色',
    name: 'fontColor',
    value: '#fff',
    type: 'color'
  }]
}, {
  width: 100,
  height: 100,
  maskable: true,
  style: {
    clipPath: 'polygon(var(--position) 0, 0% 100%, 100% 100%)',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'position',
    value: 0,
    type: 'percent'
  }, {
    label: '背景颜色',
    name: 'bgColor',
    value: '#00bf72',
    type: 'color'
  }]
}, {
  width: 100,
  height: 100,
  maskable: true,
  style: {
    clipPath: 'polygon(0 0, 0 100%, 100% var(--position))',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'position',
    value: 0,
    type: 'percent'
  }, {
    label: '背景颜色',
    name: 'bgColor',
    value: '#00bf72',
    type: 'color'
  }]
}, {
  width: 100,
  height: 100,
  maskable: true,
  style: {
    clipPath: 'polygon(0 0, 100% 0, var(--position) 100%',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'position',
    value: 100,
    type: 'percent'
  }, {
    label: '背景颜色',
    name: 'bgColor',
    value: '#00bf72',
    type: 'color'
  }]
}, {
  width: 100,
  height: 100,
  maskable: true,
  style: {
    clipPath: 'polygon(100% 100%, 100% 0, 0 var(--position)',
    backgroundColor: 'var(--bgColor)'
  },
  variables: [{
    name: 'position',
    value: 100,
    type: 'percent'
  }, {
    label: '背景颜色',
    name: 'bgColor',
    value: '#00bf72',
    type: 'color'
  }]
}, {
  width: 100,
  height: 100,
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
    value: '#00bf72',
    type: 'color'
  }]
}, {
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
    value: '#00bf72',
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
} ]