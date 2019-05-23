<template>
  <div id="album-manage">
    <table>
        <tr>
          <th>名称</th>
          <th>cover</th>
          <th>描述</th>
          <th>推荐</th>
          <th style="width: 120px">操作</th>
        </tr>
        <tr class="one-album" v-for="album in albums" :key="album._id">
          <td><input style="width: 300px;" v-model="album.name"></td>
          <td><textarea v-model="album.cover"></textarea></td>
          <td><textarea style="width: 300px;" v-model="album.desc"></textarea></td>
          <td>{{album.stories}}<input type="checkbox" v-model="album.today"></td>
          <td>
            <a @click="saveAlbum(album)">更新</a>
            <a @click="deleteAlbum(album)">删除</a>
          </td>
        </tr>
      </table>
  </div>
</template>

<script>
import RestDAO from '../common/dao/restdao.js'
export default {
  data () {
    return {
      albums: []
    }
  },
  mounted () {
    this.albumdao = new RestDAO(this.ctx, 'ybstory/album')
    this.storydao = new RestDAO(this.ctx, 'ybstory/story')
    this.loadCurrentPage()
  },
  methods: {
    async loadCurrentPage () {
      const result = await this.albumdao.list({
        sort: 'u',
        order: '-1',
        page: 1,
        count: 10000
      })
      this.albums = result.list
    },
    async saveAlbum (album) {
      try {
        const stories = await this.storydao.regex('album', album.name)
        await this.albumdao.patch(album._id, {
          cover: album.cover,
          desc: album.desc,
          stories: stories.result.length
        })
      } catch (e) {
      }
    },
    async deleteAlbum (story) {
      await this.ctx.storydao.deleteAlbum(story)
    }
  }
}
</script>

<style>

</style>
