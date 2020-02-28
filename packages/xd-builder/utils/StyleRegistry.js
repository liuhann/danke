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
  // style.setAttribute("media", "screen")
  // style.setAttribute("media", "only screen and (max-width : 1024px)")

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
    animation: ${animation.name} ${animation.duration}ms ${animation.timing} ${animation.infinite ? 'infinite' : animation.iteration} both
  }`
  sheet.insertRule(rule, pos)
}

export default class StyleRegistry {
  constructor () {
    this.sheet = createSheet('style-registry')
    this.styles = {}
    this.keyframes = {}
    this.svgs = {}
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
   * 获取作品里所有元素的样式资源
   * @param {*} work
   */
  getStyleResource (work) {
    const frames = {} // css 帧资源
    const styles = {} // css 样式资源
    for (let scene of work.scenes) {
      for (let element of scene.elements) {
        // 进入动画抽取
        if (element.enters && element.enters.length) {
          for (let animation of element.enters) {
            frames[animation.name] = this.keyframes[animation.name]
          }
        }
        // 离开动画抽取
        if (element.exists && element.exists.length) {
          for (let animation of element.exists) {
            frames[animation.name] = this.keyframes[animation.name]
          }
        }
        // 边框css样式
        if (element.border && element.border.name) {
          styles[element.border.name] = this.styles[element.border.name]
        }
      }
    }
    return {
      frames,
      styles
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
  }
}
