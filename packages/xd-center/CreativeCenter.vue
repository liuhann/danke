<template>
  <div id="creative-center" class="creative-center">
    <center-nav />
    <section class="section">
      <div class="columns is-mobile is-multiline">
        <div v-for="work in works" :key="work.id" class="column is-one-quarter-tablet is-three-quarters-mobile">
          <div class="card">
            <figure class="card-image image is-3by2">
              <div class="scene-wrapper" @mouseover="workMouseOver(work)">
                <render-scene v-if="work.scenes.length" auto-play stage="enter" :scene="work.scenes[0]" :view-box="work.viewBox" />
              </div>
            </figure>
            <div class="card-content">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-48x48">
                    <img :src="getImageUrl(work.avatar) || 'https://bulma.io/images/placeholders/96x96.png'" class="is-rounded">
                  </figure>
                </div>
                <div class="media-content">
                  {{ work.title }}
                </div>
                <nav class="level is-mobile">
                  <div class="level-left">
                    <a class="level-item" @click="editWork(work)">
                      <span class="icon is-small"><i class="fas fa-edit"></i></span>
                    </a>
                    <a class="level-item" @click="playPreviewWork(work)">
                      <span class="icon is-small"><i class="fas fa-video"></i></span>
                    </a>
                    <a class="level-item" @click="deleteWork(work)">
                      <span class="icon is-small"><i class="fas fa-trash"></i></span>
                    </a>
                    <a class="level-item" @click="shareWork(work)">
                      <span class="icon is-small"><i class="fas fa-share"></i></span>
                    </a>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import CenterNav from './CenterNav.vue'
import channels from '../site/channels'
import { getImageUrl } from '../utils/getImageUrl'
import RestDAO from '../utils/restdao'
import { fitRectIntoBounds } from '../xd-builder/mixins/rectUtils'
import RenderScene from '../xd-builder/render/RenderScene.vue'
import Vue from 'vue'
export default {
  name: 'CreativeCenter',
  components: {
    CenterNav,
    RenderScene
  },
  data () {
    return {
      isPublic: 0,
      works: [],
      publicOptions: [
        { text: '公开作品', value: 1 },
        { text: '私有作品', value: 0 }
      ],
      sceneViewPort: {
        width: 200,
        height: 160
      },
      currentChannel: 'all',
      channelOptions: channels.map(channel => ({
        text: channel.label,
        value: channel.value
      })),
      channels,
      actions: [{ text: '编辑' }, { text: '复制' }, { text: '删除' }],
      user: this.ctx.user,
      lines: []
    }
  },
  computed: {
    avatar () {
      if (this.user && this.user.avatar) {
        return this.getImageUrl(this.user.avatar, 120, 120)
      } else {
        return 'http://cdn.danke.fun/res/head.svg'
      }
    },

    nav () {
      const path = this.$route.path
      return path.substring(path.lastIndexOf('/') + 1)
    }
  },
  created () {
     this.workdao = new RestDAO(this.ctx, 'danke/work')
  },
  mounted () {
    this.loadWorks()
  },
  methods: {
    getImageUrl,
    async loadWorks () {
      const result = await this.workdao.list(Object.assign({
        page: this.page,
        count: this.count
      }, this.listQuery()))

      for (let work of result.list) {
        for (let scene of work.scenes) {
          scene.play = false
        }
      }
      
      this.works = result.list
      this.total = result.total
      this.loading = false
    },

    workMouseOver (work) {
      if (work.scenes && work.scenes[0]) {
        if (!work.scenes[0].play) {
          work.scenes[0].play = true

          setTimeout(() => {
            const scene = work.scenes[0]
            scene.play = false
            work.scenes = []

            this.$nextTick(() => {
              work.scenes.push(scene)
            })

          }, (work.scenes[0].fin - work.scenes[0].enter) * 1000)
        }
      }
    },

    resetSceneViewPort() {
      
    },

    containerFitSize (work) {
      const fit = fitRectIntoBounds(work.viewBox, {
        width: 120,
        height: 120
      })

      return {
        width: fit.width + 'px',
        height: fit.height + 'px'
      }
    },
    channelChange () {
      this.loadWorks()
    },
    editWork (work) {
      window.open(`/xd?work=${work.id}`)
    },
    listQuery () {
      const query = {
        creator: this.ctx.user.id
      }
      if (this.currentChannel !== 'all') {
        query.channels = this.currentChannel
      }
      return query
    },
    gotoAvatarHome () {
      this.$router.push('/avatar')
    },

    navTo (nav) {
      this.$router.push('/creative/' + nav)
    },

    xd ({ width, height }) {
      window.open(`/xd?width=${width}&height=${height}`)
    },

    async avatarChosen (file, uploadFiles) {
      const result = await this.imagedao.uploadBlob(file.raw, `profile`)
      await this.ctx.userdao.setAvatar(result.name)
      const user = await this.ctx.userdao.getCurrentUser()
      this.ctx.user = user
      this.user = user
    },

    playWork (work) {
      window.open('/play/fit/' + work._id)
    },

    chooseDraftWork (work) {
      this.$router.push(this.xdUrl + '?&work=' + work._id + '&ratio=' + work.ratio)
    },
    async deleteWorkDraft (work) {
      await MessageBox.confirm('确认删除此作品', '注意')
      await this.workdao.delete(work)
      this.works = []
      this.loadMyWorks()
    },
    goShareLink (work) {
      this.$router.push('/shared/' + work._id)
    }
  }
}
</script>

<style lang="scss">

.scene-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #F8F9FA;
  .scene {
    overflow: hidden;
  }
}
</style>
