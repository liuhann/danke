export default class StoryDAO {
  constructor (ctx) {
    this.ctx = ctx
  }
  async listHome () {
    const result = await this.ctx.get(`story/home`).json()
    return result
  }

  async patchStory (story) {
    await this.ctx.ky.patch(`ybstory/story/${story._id}`, {
      json: {
        title: story.title,
        album: story.album,
        label: story.label,
        teller: story.teller
      }
    })
  }

  async deleteStory (story) {
    await this.ctx.ky.patch(`ybstory/story/${story._id}`, {
      json: {
        deleted: true
      }
    })
  }

  async adminList ({
    page,
    size,
    query
  }) {
    const result = await this.ctx.get('/api/story/admin/list?skip=' + (page - 1) * this.pageSize + '&limit=' + this.pageSize);
    return result
  }

  async getStoryRelated (story) {
    const result = await this.ctx.get(`story/related/${story._id}`).json()
    return result
  }

  async listAllLabels () {
    const result = await this.ctx.get(`/story/labels`)
    return result
  }

  async getAllAlbums () {
    const result = await this.ctx.get(`/story/album/list`)
    return result
  }

  async getAlbumDetail (album) {
    const result = await this.ctx.get(`/story/album/info?album=` + album.name)
    return result
  }

  async filterStory (filter, page, count) {
    const result = await this.ctx.get(`ybstory/story/list`, {
      searchParams: Object.assign(filter, { page, count })
    }).json()
    return result
  }

  async getUserByToken (token) {
    const result = await this.ctx.get(`${this.root}/user/token/check?token=${token}`)
    return result
  }

  async getStoryContent (story) {
    const result = await this.ctx.get(`${this.root}/story/content?story=` + story._id)
    return result
  }

  async addFavorite (story, token) {
    if (this.isFavorite(story)) {
      return
    }
    this.db.get('favorites').push(story).write()
    const result = await this.ctx.post(`${this.root}/user/favorite/add?token=${token}`, story)
  }

  getFavorites () {
    return this.db.get('favorites').value()
  }

  async addDownload (story) {
    if (this.isDownloaded(story)) {
      return
    }
    story.downloaded = true
    this.db.get('downloads').push(story).write()
  }

  getDownloads () {
    return this.db.get('downloads').value()
  }

  isDownloaded (story) {
    const value = this.db.get('downloads').find({
      path: story.path
    }).value()
    if (value) {
      return true
    } else {
      return false
    }
  }

  isFavorite (story) {
    const value = this.db.get('favorites').find({
      path: story.path
    }).value()
    if (value) {
      return true
    } else {
      return false
    }
  }

  addPlayHistory (story) {
    const value = this.db.get('historys').find({
      path: story.path
    }).value()
    let count = 1
    if (value) {
      if (value.count) {
        count = value.count + 1
      }
      this.db.get('historys').remove({
        path: story.path
      }).write()
    }
    story.count = count
    story.updated = new Date().getTime()
    this.db.get('historys').push(story).write()

    this.ctx.post(`${this.root}/user/play/log?user=${localStorage.getItem('user')}`, {
      story: story.title,
      path: story.path,
      storyId: story._id
    })
  }
  getHistories () {
    const histories = this.db.get('historys').orderBy(['updated'], ['desc']).value()
    const result = {
      day3: [],
      day7: [],
      olders: []
    }

    const now = new Date().getTime()
    const day3 = 3 * 24 * 60 * 60 * 1000
    const day7 = 3 * 24 * 60 * 60 * 1000
    for (let story of histories) {
      if (now - story.updated < day3) {
        result.day3.push(story)
      } else if (now - story.updated < day7) {
        result.day7.push(story)
      } else {
        result.olders.push(story)
      }
    }
    return result
  }

  async getAlbums () {
    const result = await this.ctx.get(`ybstory/album/list`, {
      searchParams: {
        count: 1000
      }
    }).json()
    return result
  }

  async deleteAlbum (album) {
    const result = await this.ctx.delete(`ybstory/album/${album._id}`).json()
    return result
  }
}
