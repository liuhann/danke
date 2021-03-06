import { shortid } from '../../utils/string'
import RestDAO from '../../utils/restdao'
import { sleep } from '../../utils/common'

/**
 * 新增作品
 */
function newWork (size, tag) {
  const work = {
    id: shortid(10),
    title: '我的作品',
    viewBox: size || {
      width: 1080,
      height: 1920
    },
    channels: [],
    colors: [],
    scenes: [] // 场景
  }
  if (tag) {
    work.channels.push(tag)
  }
  return work
}

function addScene (work, currentScene) {
  // --------enter -------------fin--------
  const scene = {
    name: '场景',
    id: shortid(),
    elements: [],
    animation: {},
    stages: [],
    enter: 0, // 进入时间，按从作品开始时间计算
    fin: 0, // 消失时间，按从作品开始时间计算 只有进入和消失时间范围内 场景才可见  否则都是隐藏状态 
    z: 100
  }
  let prevDura = 0
  if (work != null) {
    if (currentScene == null) {
      work.scenes.push(scene)
      prevDura = getWorkDuration(work)
    } else {
      const index = (typeof currentScene === 'number') ? currentScene : work.scenes.indexOf(currentScene)
      work.scenes.splice(index, 0, scene)
      prevDura = getWorkDuration(work, index)
    }
  }

  scene.enter = prevDura
  scene.fin = prevDura + 3
  return scene
}

// 整理work的信息
function tidyUpWork (work) {
  for (const scene of work.scenes) {
    // 使用秒为单位
    if (scene.enter > 1000) {
      scene.enter = scene.enter / 1000
    }
    if (scene.fin > 1000) {
      scene.fin = scene.fin / 1000
    }
    // exit并入作为一个stage
    if (scene.exit) {
      delete scene.exit
    }
    scene.play = false
    scene.seek = 0
    for (const element of scene.elements) {
      if (element.animation.enter) {
        element.animation = element.animation.enter
      }
    }
  }
  return work
}

function prevScene (work, currentScene) {
  const index = (typeof currentScene === 'number') ? currentScene : work.scenes.indexOf(currentScene)
  if (index > 0) {
    return work.scenes[index - 1]
  } else {
    return work.scenes[index]
  }
}

function nextScene (work, currentScene) {
  const index = (typeof currentScene === 'number') ? currentScene : work.scenes.indexOf(currentScene)
  if (index < work.scenes.length - 1) {
    return work.scenes[index + 1]
  } else {
    return work.scenes[index]
  }
}

function getBackGroundScene (work, currentScene) {
  const index = (typeof currentScene === 'number') ? currentScene : work.scenes.indexOf(currentScene)

  for (let i = index - 1; i >= 0; i--) {
    if (work.scenes[i].background === true) {
      return work.scenes[i]
    }
  }
  return null
}

/**
 * 收集所有的作品使用颜色
 */
function getWorkColors (work) {
  if (work) {
    let colors = []
    for (const scene of work.scenes) {
      for (const element of scene.elements) {
        if (element.variables) {
          colors = colors.concat(element.variables.filter(variable => variable.type === 'color').map(variable => variable.value))
        }
      }
    }
    return Array.from(new Set(colors))
  } else {
    return []
  }
}

// 获得Work中所有包含的图片
function getWorkImages (work) {
  const elementUrls = {}
  for (const scene of work.scenes) {
    for (const element of scene.elements) {
      if (element.url) {
        elementUrls[element.id] = element.url
      }
    }
  }
  return elementUrls
}

// 获得Work总的持续时长, index表示限制场景局部限制
function getWorkDuration (work, index) {
  let finSec = 0

  for (let i = 0; i < work.scenes.length; i++) {
    if (index != null && i > index) break;

    const scene = work.scenes[i]

    const lastSec = parseInt(scene.fin) || 0

    if (lastSec && lastSec > finSec) {
      finSec = lastSec
    }
  }
  return finSec
}

/**
 * 定位到某个frame， 仅用于自动播放的场景,
 * @param work
 * @param mill
 */
function seekToMill (work, mill) {
  // 根据当前时间计算每个场景的stage及seek
  // -----cm-------------cm-------------cm---------cm---
  // -----------enter -----------exit -----fin--------
  const sec = mill / 1000
  for (const scene of work.scenes) {
    if (sec < scene.enter) {
      scene.visible = false
      scene.play = false
      scene.seek = 0
    } else if (sec >= scene.fin) {
      scene.play = false
      scene.visible = false
      scene.seek = 0
    } else {
      scene.visible = true
      scene.play = true
      scene.seek = (sec - scene.enter) * 1000
    }
  }
}

// 将每个场景按照enter、exit、fin指定的时间进行场景属性切换
// -----------enter -----------exit ----fin--------
async function scheduleWorkPlay (work) {
  const promises = []
  for (const scene of work.scenes) {
    scene.play = false
    scene.visible = false
    promises.push((async () => {
      await sleep(scene.enter * 1000)
      scene.play = true
      scene.visible = true
    })())

    promises.push((async () => {
      await sleep(scene.fin * 1000)
      scene.play = false
      scene.visible = false
    })())
  }
  await Promise.all(promises)

  work.scenes[0].visible = true
}

/**
 * 保存作品内容
 */
async function saveWork (work, ctx) {
  if (!ctx) {
    ctx = window.ctx
  }
  const workdao = new RestDAO(ctx, 'danke/work')

  const detached = JSON.parse(JSON.stringify(work))
  detached.creator = ctx.user.id
  detached.avatar = ctx.user.avatar

  detached.snapshot = ''
  if (!detached._id) {
    detached.creator = ctx.user.id
    const result = await workdao.create(detached)
    detached._id = result.object._id
  } else {
    await workdao.patch(detached.id, detached)
  }
  return detached
}

export {
  tidyUpWork,
  scheduleWorkPlay,
  getWorkDuration,
  seekToMill,
  getBackGroundScene,
  newWork,
  addScene,
  prevScene,
  nextScene,
  getWorkColors,
  saveWork,
  getWorkImages
}
