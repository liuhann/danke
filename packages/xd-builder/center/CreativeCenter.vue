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
            <img :src="user.avatar || 'http://cdn.danke.fun/res/head.svg'">
          </el-upload>
        </div>
        <div class="user">
            <div class="user-name">
              {{user.id}}
            </div>
        </div>
      </div>
      <button class="button" slot="reference" @click="navNew">创建新的作品</button>
      <div class="menu">
        <div class="node" :class="nav==='my'? 'selected': ''" @click="navMyWork">
          <span>我的作品</span>
        </div>
        <div class="node">
          <span>模板中心</span>
        </div>
        <div class="node">
          <span>我的资源</span>
        </div>
        <div class="tree-node">
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
import ImageDAO from '../utils/imagedao'
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
      return this.ctx.user.avatar
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
    navMyWork () {
      this.$router.replace('/creative/my')
    },
    navNew () {
      this.$router.replace('/creative/new')
    },

    xd ({ width, height }) {
      window.open(`/xd?width=${width}&height=${height}`)
    },

    // may be choose multiple files, should do auto upload on choose
    // each file would trigger fileChoosed event
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
    padding: 0 2rem;
    flex: 1;
    .nav {
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
            height: 46px;
          }
        }
        .user {
          padding-left: 10px;
        }
      }
      button {
        font-size: 1.5rem;
        color: #fff;
        width: 160px;
        margin: 0 20px;
        height: 40px;
        letter-spacing: .2rem;
        line-height: 1.4;
        transition: background-color .1s linear,border-color .1s linear,color .1s linear;
        vertical-align: middle;
        align-items: center;
        background-color: #00c4cc;
        border: 2px solid transparent;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        padding: 0 6px;
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
