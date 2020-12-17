/**
 * 创建样式标签
 * @param {*} id
 */
function createSheet (id) {
  // Create the <style> tag
  var style = document.createElement('style')
  if (id) {
    style.id = id
  }
  // Add a media (and/or media query) here if you'd like!

  // WebKit hack :(
  style.appendChild(document.createTextNode(''))

  // Add the <style> element to the page
  document.head.appendChild(style)
  return style.sheet
}

function createSvg (id) {
  var svg = document.createElement('svg')
  if (id) {
    svg.id = id
  }
  // Add a media (and/or media query) here if you'd like!

  svg.style.display = 'none'

  // Add the <style> element to the page
  document.body.appendChild(svg)
  return svg
}

/**
 * 增加一项样式规则
 * @param {*} sheet
 * @param {*} styleText
 */
function addStyle (sheet, styleText) {
  let pos = sheet.length
  sheet.insertRule(styleText, pos)
}

/**
 * 增加一项keyframe规则
 * @param {*} sheet
 * @param {*} name
 * @param {*} frames
 */
function addKeyFrames (sheet, name, frames) {
  let pos = sheet.length
  const rule = '@keyframes ' + name + '{' + frames + '}'
  sheet.insertRule(rule, pos)
}

/**
  animation: focus-in-expand-fwd 0.8s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}
 * @param animation
 */
function addAnimation (sheet, animation) {
  let pos = sheet.length
  const rule = `.${animation.name} {
    animation: ${animation.name} ${animation.duration}ms ${animation.timing} both
  }`

  sheet.insertRule(rule, pos)
}

async function addFontFace (sheet, url, id) {
  // let pos = sheet.length

  const ff = new FontFace(id, `url('${url}')`)

  await ff.load()

  document.fonts.add(ff)
  //
  // sheet.insertRule(`@font-face {
  //   font-family: ${id};
  //   src: url('${url}');
  // }`, pos)
}

export default class StyleRegistry {
  constructor (ctx) {
    this.sheet = createSheet('style-registry')
    this.styles = {}
    this.svgfilters = []
    this.keyframes = {}
    this.svgs = {}
    this.fonts = {}
  }

  clear () {
    if (this.sheet && this.sheet.parentElement) {
      this.sheet.parentElement.removeChild(this.sheet)
    }
    this.sheet = createSheet('style-registry')
    this.svg = createSvg('svg-filter-registry')
    this.svgfilters = []
    this.styles = {}
    this.keyframes = {}
    this.svgs = {}
    this.fonts = {}
  }
  /**
   * 统一增加SVG内容，避免SVG图片反复使用存储位置过多的问题。 一些SVG图片也有近100K大小
   * @param {*} vector
   */
  addVector (vector) {
    this.svgs[vector._id] = vector.content
  }

  getVector (id) {
    return this.svgs[id]
  }

  async addFontFace (fontface) {
    let font = fontface
    if (typeof font === 'string') {
      font = fontFamilies.filter(f => f.id === fontface)[0]
    }
    if (font && font.url && !this.fonts[font.id]) {
      await addFontFace(this.sheet, font.url, font.id)
      this.fonts[font.id] = font.url
    }
  }

  /**
   * 增加样式信息，支持多行
   * @param {*} style
   */
  addStyle (style) {
    // 检查是否已经存储
    if (!this.styles[style.name]) {
      this.styles[style.name] = style.cssContent
      // 用2个回车来切分样式表中多个
      const splits = style.cssContent.split('}')
      for (let css of splits) {
        if (css && css.trim()) {
          try {
            addStyle(this.sheet, css + '}')
          } catch (e) {
            console.log('illgel css content', css)
            // ignore css text errors
          }
        }
      }
      if (style.svgContent) {
        this.svgfilters.push(style.svgContent)
      }
    }
  }

  addFrames (frames) {
    for (let key in frames) {
      this.addFrame({
        name: key,
        cssFrame: frames[key]
      })
    }
  }

  /**
   * 增加frame列表
   * @param {*} frame
   */
  addFrame (frame) {
    if (!this.keyframes[frame.name]) {
      this.keyframes[frame.name] = frame.cssFrame
      addKeyFrames(this.sheet, frame.name, frame.cssFrame)
      addAnimation(this.sheet, frame)
    }
  }

  /**
   * 收集所有的作品使用颜色
   */
  getWorkColors (work) {
    let colors = []
    for (let scene of work.scenes) {
      colors = colors.concat(this.getColorsFromStyle(scene.style))
      for (let element of scene.elements) {
        colors = colors.concat(this.getColorsFromStyle(element.style))
      }
    }
    return Array.from(new Set(colors))
  }

  getColorsFromStyle (style) {
    const colors = []
    for (let key in style) {
      if (key === 'background') {
        colors.push(style[key])
      }
      if (key === 'color') {
        colors.push(style[key])
      }
    }
    return colors
  }
}
