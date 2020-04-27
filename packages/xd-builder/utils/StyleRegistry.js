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

function addFontFace(sheet, url, id) {
  let pos = sheet.length
  sheet.insertRule(`@font-face {
    font-family: ${id};
    src: url('${url}');
  }`, pos)
}

export const fontFamilies = [{
  id: '微软雅黑',
  name: '系统字体',
}, {
  id: 'HYLeMiaoTiJ',
  name: '汉仪乐喵体简',
  url: 'https://font-public.canva.cn/YAC1IZZZHQU/0/HYLeMiaoTiJ.woff'
}, {
  id: 'HYZiYanHuanLeSongW',
  name: '汉仪字研欢乐宋',
  url: 'https://font-public.canva.cn/YAC1EHq8QNU/0/HYZiYanHuanLeSongW.woff'
}]

export default class StyleRegistry {
  constructor () {
    this.sheet = createSheet('style-registry')
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

  addFontFace (fontface) {
    let font = fontface
    if (typeof font === 'string') {
      font = fontFamilies.filter(f => f.id === fontface)[0]
    }
    if (!this.fonts[font.id]) {
      addFontFace(this.sheet, font.url, font.id)
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
      const splits = style.cssContent.split('\n\n')
      for (let css of splits) {
        if (css && css.trim()) {
          try {
            addStyle(this.sheet, css)
          } catch (e) {
            // ignore css text errors
          }
        }
      }
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
  getWorkColors(work) {
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

  /**
   * 抽取作品里所有元素的样式资源，包括动画、SVG图片及字体
   * @param {*} work
   */
  getStyleResource (work) {
    const frames = {} // css 帧资源
    const styles = {} // css 样式资源
    const svgs = {}
    const fonts = new Set()
    for (let scene of work.scenes) {
      if (!scene.animation) {
        scene.animation = {}
      }
      for (let element of scene.elements) {
        // element.animation.enters = [{name: 'fade-in'}]
        // element.animation.exists = [{name: 'fade-out'}]
        for (let key in element.animation) {
          for (let anima of element.animation[key]) {
            frames[anima.name] = this.keyframes[anima.name]
          }
        }
        if (element.svg) {
          svgs[element.svg] = element.content
        }
        if (element.variables && element.variables.length) {
          element.variables.forEach(variable => {
            if (variable.type === 'fontFamily') {
              fonts.add(variable.value)
            }
          })
        }
      }
    }
    return {
      frames,
      styles,
      svgs,
      fonts: Array.from(fonts)
    }
  }

  /**
   * 获取、初始化作品里所有元素的样式资源
   */
  initWorkStyleResource (work) {
    for (let name in work.frames) {
      this.addFrame({
        name,
        cssFrame: work.frames[name]
      })
    }
    for (let name in work.styles) {
      this.addStyle({
        name,
        cssContent: work.styles[name]
      })
    }
    if (work.fonts && work.fonts.length) {
      for (let font of work.fonts) {
        this.addFontFace(font)
      }
    }

    // init element svg content from work.svgs
    for (let scene of work.scenes) {
      for (let element of scene.elements) {
        if (element.svg) {
          element.content = work.svgs[element.svg]
        }
      }
    }
  }
}
