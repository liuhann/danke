<template>
<div class="creative-center">
  <div class="main">
    <div class="nav">
      <div class="me">
        <div class="avatar">
          <el-upload
            :auto-upload="false" action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            ref="imageUpload"
            class="upload-container"
            :on-change="avatarChosen">
            <img :src="avatar">
          </el-upload>
        </div>
        <div class="user">
          <div class="user-name">
            {{user.nick || user.id}}
          </div>
          <div class="location">
            {{user.location ||　'火星'}}
          </div>
        </div>
      </div>
      <button class="button" slot="reference" @click="navTo('new')">创建新的作品</button>
      <div class="menu">
        <div class="node" :class="nav==='my'? 'selected': ''" @click="navTo('my')">
          <span>我的作品</span>
        </div>
        <div class="node">
          <span>模板中心</span>
        </div>
        <div class="node">
          <span>我的图库</span>
        </div>
        <div class="node" :class="nav==='packs'? 'selected': ''" @click="navTo('packs')">
          <span>设计图库</span>
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
import workType from './workType'
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
      workType,
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
  --mainColor: #00c4cc;
  --mainColorHover: rgba(0, 196, 204, 0.61);
  --textMainColor: #0e1318;
  --textMinorColor: rgba(14,19,24,.3);
  height: 100%;
  display: flex;
  flex-direction: column;
  button {
    font-size: 1.5rem;
    color: #fff;
    margin: 10px;
    height: 40px;
    letter-spacing: .2rem;
    line-height: 1.4;
    transition: background-color .1s linear,border-color .1s linear,color .1s linear;
    vertical-align: middle;
    align-items: center;
    background-color: var(--mainColor);
    border: 2px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    padding: 0 10px;
    &.small {
      line-height: 1.2;
      margin: 0 10px;
      height: 30px;
    }
    &:hover {
      background-color: var(--mainColorHover);
    }
    &.plain {
      color: var(--mainColor);
      background-color: transparent;
    }
  }
  .top-header {
    height: 5rem;
    box-shadow: 0 0 3px #ccc;
    padding: 0 2rem;
  }
  .main {
    display: flex;
    padding: 0 2rem;
    flex: 1;
    .nav {
      color: var(--textMainColor);
      width: 200px;
      height: calc(100% - 4rem);
      margin: 2rem 0;
      box-sizing: content-box;
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
          font-size: 1.5rem;
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 4px;
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
    .body {
      .my-work-list {
        .line {
          display: flex;
          justify-content: space-between;
          margin: 2rem 0;
        }
      }
    }
    .content-title {
      font-size: 2.4rem;
      padding: 1.6rem;
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
