import { shortid } from '../../utils/string'
import RestDAO from '../../utils/restdao'


function addScene () {
  const scene = {
    name: '场景',
    id: shortid(),
    elements: [],
    animation: {},
    color: '',
    z: 100,
    delay: 0,
    duration: 3,
    exit: 1
  }
  return scene
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
  addScene,
  saveWork
}