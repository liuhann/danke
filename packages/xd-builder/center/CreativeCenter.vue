<template>
  <div class="creative-center">
    <div class="main">
      <div class="nav">
        <div class="me">
          <div class="avatar" @click="gotoAvatarHome">
            <img :src="avatar">
          </div>
          <div class="user">
            <div class="user-name">
              {{ user.nick || user.id }}
            </div>
            <div class="location">
              {{ user.location ||　'火星' }}
            </div>
          </div>
        </div>
        <button slot="reference" class="button is-primary is-small ml-10" @click="navTo('new')">创建新的作品</button>
        <div class="menu">
          <div class="node" :class="nav==='my'? 'selected': ''" @click="navTo('my')">
            <span>我的作品</span>
          </div>
          <div class="node tree-node" :class="nav==='profile'? 'selected': ''" @click="navTo('profile')">
            <span>设置</span>
          </div>
        </div>
      </div>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import StyleRegistry from '../utils/StyleRegistry'
import { Popover, Upload } from 'element-ui'
import ImageDAO from '../../utils/imagedao'
import { getImageUrl } from '../mixins/imageUtils'
export default {
  name: 'CreativeCenter',
  components: {
    [Popover.name]: Popover,
    [Upload.name]: Upload
  },
  filters: { },
  data () {
    return {
      user: this.ctx.user,
      lines: []
    }
  },
  computed: {
    avatar () {
      if (this.user && this.user.avatar) {
        return this.getImageUrl(this.user.avatar, 96, 96)
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
    this.imagedao = new ImageDAO(this.ctx)
  },
  mounted () {
    this.ctx.styleRegistry = new StyleRegistry()
  },
  methods: {
    getImageUrl,

    gotoAvatarHome () {
      this.$router.replace('/avatar')
    },

    navTo (nav) {
      this.$router.replace('/creative/' + nav)
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
