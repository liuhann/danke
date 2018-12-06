/* global wx:true */
function request (data, complete, isCache) {
  wx.cloud.callFunction({
    // 需调用的云函数名
    name: 'dkapi',
    // 传给云函数的参数
    data,
    // 成功回调
    complete
  })
}

function addWork (work, cb) {
  request({
    method: 'post',
    path: '/danke/work',
    body: work
  }, (response) => {
    if (response.result) {
      cb(response.result)
    }
  })
}

function listTemplates (cb) {
  wx.cloud.callFunction({
    // 需调用的云函数名
    name: 'dkapi',
    // 传给云函数的参数
    data: {
      method: 'get',
      path: '/danke/templates'
    },
    // 成功回调
    complete: (response) => {
      if (response.result) {
        cb(response.result)
      }
    }
  })
}

function getTemplateByName (name, cb) {
  request({
    method: 'get',
    path: '/danke/template/' + name
  }, (response) => {
    if (response.result) {
      cb(response.result)
    }
  }, true)
}

function getWorkByUid (uid, cb) {
  wx.cloud.callFunction({
    // 需调用的云函数名
    name: 'dkapi',
    // 传给云函数的参数
    data: {
      method: 'get',
      path: '/danke/work/' + uid
    },
    // 成功回调
    complete: (response) => {
      if (response.result) {
        cb(response.result)
      }
    }
  })
}

function getFeaturedWorks (cb) {
  wx.cloud.callFunction({
    // 需调用的云函数名
    name: 'dkapi',
    // 传给云函数的参数
    data: {
      method: 'get',
      path: '/danke/work/featured'
    },
    // 成功回调
    complete: (response) => {
      if (response.result) {
        cb(response.result)
      }
    }
  })
}

function getMyWorks (cb) {
  request({
    method: 'get',
    path: '/danke/work/mine'
  }, (response) => {
    if (response.result) {
      cb(response.result)
    }
  })
}

function removeMyWork (workId, cb) {
  request({
    method: 'delete',
    path: '/danke/work/' + workId
  }, (response) => {
    if (response.result) {
      cb(response.result)
    }
  })
}

function shareWork (share, cb) {
  wx.cloud.callFunction({
    // 需调用的云函数名
    name: 'dkapi',
    // 传给云函数的参数
    data: {
      method: 'post',
      path: '/danke/work/share',
      query: share
    },
    // 成功回调
    complete: (response) => {
      if (response.result) {
        cb(response.result)
      }
    }
  })
}

function getCurrentUser (cb) {
  request({
    method: 'get',
    path: '/danke/weixin/me'
  }, (response) => {
    if (response.result) {
      cb(response.result)
    }
  }, true)
}

function setCurrentUser (uinfo, cb) {
  wx.cloud.callFunction({
    // 需调用的云函数名
    name: 'dkapi',
    // 传给云函数的参数
    data: {
      method: 'post',
      path: '/danke/weixin/me',
      body: uinfo
    },
    // 成功回调
    complete: (response) => {
      if (response.result) {
        cb(response.result)
      }
    }
  })
}

// 传输到BOS
function transferToBCC (tempFileURL, workId, cb) {
  request({
    method: 'get',
    path: '/danke/mini/file/transfer',
    query: {
      url: tempFileURL,
      workId: workId
    }
  }, (response) => {
    cb(response)
  })
}

function loadShowImages (workId, cb) {
  wx.cloud.callFunction({
    // 需调用的云函数名
    name: 'dkapi',
    // 传给云函数的参数
    data: {
      method: 'get',
      path: '/danke/work/images/' + workId
    },
    // 成功回调
    complete: (response) => {
      cb(response.result.list)
    }
  })
}

export default {
  getCurrentUser,
  setCurrentUser,
  addWork,
  shareWork,
  getWorkByUid,
  getTemplateByName,
  getFeaturedWorks,
  getMyWorks,
  removeMyWork,
  listTemplates,
  transferToBCC,
  loadShowImages
}
