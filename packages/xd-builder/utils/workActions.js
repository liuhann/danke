import { shortid } from '../../utils/string'
import RestDAO from '../../utils/restdao'

/**
 * 新增作品
 */
function newWork (size) {
  return {
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
}

function addScene (work, currentScene) {
  // --------enter -----------exit ----fin--------
  const scene = {
    name: '场景',
    id: shortid(),
    elements: [],
    animation: {},
    background: false,
    z: 100,
    enter: 0,
    exit: 0,
    fin: 0
  }
  if (work != null) {
    if (currentScene == null) {
      work.scenes.push(scene)
    } else {
      const index = (typeof currentScene === 'number') ? currentScene : work.scenes.indexOf(currentScene)
      work.scenes.splice(index, 0, scene)
    }
  }
  return scene
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

  for (let i = index - 1; i >=0 ; i-- ) {
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
    for (let scene of work.scenes) {
      for (let element of scene.elements) {
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

function getWorkImages (work) {
  const elementUrls = {}
  for (let scene of work.scenes) {
    for (let element of scene.elements) {
      if (element.url) {
        elementUrls[element.id] = element.url
      }
    }
  }
  return elementUrls
}

/**
 * 定位到某个frame， 仅用于自动播放的场景
 * @param work
 * @param mill
 */
function seekToMill (work, cm) {
  // 根据当前时间计算每个场景的stage及seek
  //-----cm-------------cm-------------cm---------cm---
  //-----------enter -----------exit ----fin--------
  for (let scene of work.scenes) {
    if (cm < scene.enter ) {
      scene.stage = 'before'
      scene.visible = false
    } else if (cm > scene.enter && cm < scene.exit) {
      scene.visible = true
      scene.stage = 'enter'
      scene.seek = cm - scene.enter
    } else if (cm > scene.exit && cm < scene.fin ) {
      scene.visible = true
      scene.stage = 'exit'
      scene.seek = cm - scene.exit
    } else {
      scene.visible = false
      scene.stage = ''
      scene.seek = 0
    }
  }
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
