<template>
  <div id="creative-center" class="creative-center">
    <nav-bar title="我的作品"></nav-bar>
    <section class="section">
      <div class="columns is-mobile">
        <div class="column is-narrow">
          <button class="button is-primary" @click="navTo('new')">创建作品</button>
        </div>
        <div class="column has-text-right">
          <div class="select">
            <select v-model="currentChannel" @change="channelChange">
              <option value="all">全部</option>
              <option v-for="channel in channels" :key="channel.value" :value="channel.value">{{ channel.label }}</option>
            </select>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
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
                <p class="title is-3 is-size-5">{{ work.title }}</p>
                <p class="has-text-grey">{{ work.updated }}</p>
                <div class="buttons mt-2">
                  <button class="button is-success is-light" @click="editWork(work)">编辑</button>
                  <button class="button is-info is-light">预览</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import workListMixins from '../mixins/workListMixins'
import NavBar from '../../site/components/NavBar'
import channels from '../../site/channels'
import { getImageUrl } from '../mixins/imageUtils'
import { fitRectIntoBounds } from '../mixins/rectUtils'
export default {
  name: 'CreativeCenter',
  components: {
    NavBar
  },
  mixins: [ workListMixins ],
  data () {
    return {
      channels,
      currentChannel: 'all',
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
      this.$router.replace(`/xd-lite?work=${work.id}`)
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
      this.$router.replace('/avatar')
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
  --mainColor: rgba(0, 196, 204);
  --mainColorHover: rgba(0, 196, 204, 0.61);
  --textMainColor: #0e1318;
  --textMinorColor: rgba(14,19,24,.3);
  height: 100%;
  display: flex;
  flex-direction: column;
  .top-header {
    height: 5rem;
    box-shadow: 0 0 3px #ccc;
    padding: 0 2rem;
  }
  .main {
    display: flex;
    height: 100%;
    flex: 1;
    .nav {
      color: var(--textMainColor);
      width: 200px;
      height: calc(100% - 4rem);
      background-color: #fefefe;
      box-sizing: content-box;
      border-right: 1px solid #efefef;
      padding: 2rem 0;
      .me {
        padding: 8px 12px;
        display: flex;
        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          img {
            width: 48px;
            height: 48px;
            border-radius: 100%;
          }
        }
        .user {
          padding-left: 10px;
          line-height: 26px;
          font-size: 14px;
          .location {
            line-height: 16px;
            color: var(--textMinorColor);
            cursor: pointer;
          }
        }
      }
      .menu {
        margin: 1rem 0;
        display: flex;
        flex-direction: column;
        .node {
          font-size: 1.125rem;
          padding: 8px 12px;
          cursor: pointer;
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          position: relative;
          box-sizing: border-box;
          white-space: nowrap;
          transition: background-color .15s ease-in-out,opacity .15s ease-in-out;
          color: unset;
          text-decoration: unset;
          &:hover {
            background-color: rgba(14,19,24,.07);
          }
          &.selected {
            font-weight: bold;
            border-left: 4px solid #00c4cc
          }
        }
      }
    }
  }
  .content {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #fafafa;
    .content-title {
      font-size: 1.5rem;
      padding: 1.6rem;
      padding-bottom: .4rem;
      span.tab {
        margin-right: 2rem;
        font-size: 1.8rem;
        cursor: pointer;
        transition: font-size .2s ease-in;
        &:hover {
          color: var(--mainColorHover);
        }
        &.on {
          font-size: 2.4rem;
          color: var(--mainColor);
        }
      }
    }
    .empty {
      font-size: 2rem;
      color: #333;
      padding: 10rem;
      text-align: center;
      .desc {
        color: #999;
        line-height: 4rem;
        font-size: 1.6rem;
      }
    }
  }
}
</style>
