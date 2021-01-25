<template>
  <div id="creative-center" class="creative-center">
    <nav-bar title="我的作品"></nav-bar>
    <van-button id="btn-new" type="primary" @click="navTo('new')" icon="plus">创建作品</van-button>
    <div class="container">
      <van-tabs v-model="isPublic">
        <van-tab title="私有作品"></van-tab>
        <van-tab title="公开作品"></van-tab>
      </van-tabs>
      <div class="columns is-mobile is-multiline work-list is-1">
        <div v-for="work in works" :key="work.id" class="column work-container is-full-mobile is-4-tablet is-3-desktop is-3-fullhd">
          <div class="box">
            <div class="columns is-mobile">
              <div class="column preview is-narrow">
                <div class="work-image-container">
                  <img v-if="work.snapshot" :src="getImageUrl(work.snapshot, 120, 120, 'lfit')">
                </div>
                <span v-if="!work.snapshot" class="no-snapshot">正在生成预览</span>
              </div>
              <div class="column">
                <div class="work-title">{{ work.title }}</div>
                <div class="buttons mt-2">
                  <van-button type="primary" @click="playWork(work)">预览</van-button>
                  <van-popover trigger="click" :actions="actions">
                    <template #reference>
                      <van-button type="primary">深色风格</van-button>
                    </template>
                  </van-popover>
                  <button class="button is-success is-light" @click="editWork(work)">编辑</button>
                  <button class="button is-info is-light">预览</button>
                  <button class="button is-info is-light" @click="deleteWork(work)">删除</button>
                  <button class="button is-info is-light">复制</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import workListMixins from '../mixins/workListMixins'
import NavBar from '../../site/components/NavBar'
import channels from '../../site/channels'
import { getImageUrl } from '../mixins/imageUtils'
import { fitRectIntoBounds } from '../mixins/rectUtils'
import Vue from 'vue'
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
export default {
  name: 'CreativeCenter',
  components: {
    NavBar
  },
  mixins: [ workListMixins ],
  data () {
    return {
      isPublic: 0,
      publicOptions: [ 
        { text: '公开作品', value: 1 },
        { text: '私有作品', value: 0 }
      ],
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
  },
  mounted () {
    this.loadWorks()
  },
  methods: {
    getImageUrl,
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
      this.$router.push(`/xd-lite?work=${work.id}`)
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

.work-list {
  .preview {
    display: flex;
    justify-content: center;
    align-items: center;
    .no-snapshot {
      position: absolute;
      color: #aaacad;
    }
    .work-image-container {
      width: 120px;
      height: 120px;
      border:1px solid #e7e7e7;
      border-radius: 6px;
      background-color: #fff;
      background-image: linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef),
      linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef);
      background-size: 20px 20px;
      background-position: 0 0, 10px 10px;
    }
  }
}
.creative-center {
  #btn-new {
    position: fixed;
    right: 2rem;
    bottom: 2rem;
    z-index: 1001;
  }
}
</style>
