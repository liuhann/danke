export default class LocalDAO {
  constructor () {
    this.favorites = JSON.parse(window.localStorage.getItem('ybstory-favorites') || '[]')
    this.histories = JSON.parse(window.localStorage.getItem('ybstory-histories') || '[]')
  }

  async addFavorite (story) {
    if (this.isFavorite(story)) {
      return
    }
    this.favorites.push(story)
    window.localStorage.setItem('ybstory-favorites', JSON.stringify(this.favorites))
  }

  getFavorites () {
    return this.favorites
  }
  isFavorite (story) {
    const sames = this.favorites.filter((e) => {
      return e.path === story.path
    })
    return sames.length > 0
  }
  addPlayHistory (story) {
    for (let i = 0; i < this.histories.length; i++) {
      if (this.histories[i].path === story.path) {
        this.histories.splice(i, 1)
        break
      }
    }
    this.histories.push(story)
    story.updated = new Date().getTime()
    window.localStorage.setItem('ybstory-histories', JSON.stringify(this.histories))
  }
  getHistories () {
    const histories = this.histories
    const result = {
      day3: [],
      day7: [],
      olders: [],
      total: this.histories.length
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
}
