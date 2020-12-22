import { shortid } from '../../utils/string'
import RestDAO from '../../utils/restdao'


function addScene (work, currentScene) {
  const scene = {
    name: '场景',
    id: shortid(),
    elements: [],
    animation: {},
    background: false,
    z: 100,
    delay: 0,
    duration: 3,
    exit: 1
  }

  if (work != null && currentScene != null) {
    const index = (typeof currentScene === 'number') ? currentScene : work.scenes.indexOf(currentScene)
    work.scenes.splice(index, 0, scene)
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
 * 保存作品内容
 */
async function saveWork (work, ctx) {
  if (!ctx) {
    ctx = window.ctx
  }
  const workdao = new RestDAO(ctx, 'danke/work')

  const detached = JSON.parse(JSON.stringify(this.work))
  detached.creator = ctx.user.id
  detached.avatar = ctx.user.avatar

  detached.snapshot = ''
  if (!detached._id) {
    detached.creator = ctx.user.id
    const result = await workdao.create(detached)
    detached._id = result.object._id
    this.$router.replace(location.pathname + '?work=' + this.work.id)
  } else {
    await workdao.patch(detached.id, detached)
  }
  // 处理作品的预览
  // 发出请求获取最新的work-preview
  ctx.get('/danke/preview/download?id=' + detached.id)
  return detached
}

export {
  getBackGroundScene,
  addScene,
  prevScene,
  nextScene,
  saveWork
}