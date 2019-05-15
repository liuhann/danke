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
