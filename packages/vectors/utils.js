export function getSVGViewBox (svg) {
  const viewboxs = svg.match(/viewBox="[^"]+/)[0].split(' ')
  if (viewboxs.length === 4) {
    return {
      width: Number.parseInt(viewboxs[2]),
      height: Number.parseInt(viewboxs[3])
    }
  } else {
    return {}
  }
}


export const presets = ['SVG', '动画', '线条', '波浪', '气泡', '头像修饰']
