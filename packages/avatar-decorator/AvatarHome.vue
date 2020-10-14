<template>
  <div id="avatar-home">
    <div class="container">
      <div class="logo-wrapper">
        <img :src="logo" />
        <p class="share">由 <a href="http://danke.fun">蛋壳分享</a>提供</p>
      </div>
      <div class="raw-avatar">
        <div>
          <el-upload
            ref="imageUpload" :auto-upload="false"
            action="http://danke.fun"
            :show-file-list="false"
            class="upload-container"
            :on-change="avatarChosen"
          >
            <img class="raw" :src="userAvatar" />
          </el-upload>
        </div>
        <div class="raw-preview">
          <div ref="preview" class="size-rect">
          </div>
          <div class="size-circle">
          </div>
          <div class="size-radius-20">
          </div>
          <div class="size-radius-40">
          </div>
        </div>
        <el-button class="button" type="primary">定  制</el-button>
      </div>
      <div class="template-recents">
        <div class="title">
          最新
        </div>
        <ul class="work-list-wrapper">
          <li v-for="work in recents" :key="work._id">
            <div class="scene-wrapper" :style="{
                   width: viewport.width + 'px',
                   height: viewport.height + 'px'
                 }"
                 @click="applyDecorator(work)"
            >
              <render-scene :view-box="work.viewBox" :scene="work.scenes[0]" :view-port="work.viewport" :stage="work.stage" />
            </div>
          </li>
        </ul>
      </div>
      <div class="template-category">
      </div>
    </div>
  </div>
</template>

<script>
import RestDAO from '../utils/restdao'
import { Upload, Button } from 'element-ui'
import logo from './D.png'
import { getImageUrl } from '../xd-builder/mixins/imageUtils'
import RenderScene from '../xd-builder/render/RenderScene'
import ImageDAO from '../utils/imagedao'
import { fitRectIntoBounds } from '../xd-builder/mixins/rectUtils'
import StyleRegistry from '../xd-builder/utils/StyleRegistry'
export default {
  name: "AvatarHome",
  components: {
    [Upload.name]: Upload,
    [Button.name]: Button,
    RenderScene
  },
  data () {
    return {
      logo,
      user: this.ctx.user,
      currentWork: {},
      viewport: {
        width: 240,
        height: 240
      },
      recents: []
    }
  },
  computed: {
    userAvatar () {
      if (this.user && this.user.avatar) {
        return this.getImageUrl(this.user.avatar, 240, 240)
      } else {
        return ''
      }
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    this.imagedao = new ImageDAO(this.ctx)
    this.styleRegistry = new StyleRegistry(this.ctx)
  },

  mounted () {
    this.loadWorks()
    if (window.screen.width < 720) {
      this.viewport.width = (window.screen.width - 40 ) / 3 - 10
      this.viewport.height = (window.screen.width - 40 ) / 3 - 10
    }
  },

  methods: {
    getImageUrl,

    applyDecorator (work) {
      this.currentWork = JSON.parse(JSON.stringify(work))
      this.setWorkVariable()
    },

    setWorkAvatar (work) {
      for (let element of work.scenes[0].elements) {
        if (element.name === 'avatar') {
          element.url = this.user.avatar
        }
      }
    },

    async loadWorks () {
      const result = await this.workdao.list(Object.assign({
        'system.app': 'avatar',
        page: this.page,
        count: this.count
      }))
      for (let work of result.list) {
        work.stage = 'enter'
        if (work.fonts) {
          for (let font of work.fonts) {
            this.styleRegistry.addFontFace(font)
          }
        }
        work.viewport = this.viewport
        this.setWorkAvatar(work)
        this.recents.push(work)
      }
    },

    async avatarChosen (file, uploadFiles) {
      const result = await this.imagedao.uploadBlob(file.raw, `profile`)
      await this.ctx.userdao.setAvatar(result.name)
      const user = await this.ctx.userdao.getCurrentUser()
      this.ctx.user = user
      this.user = user
    },
  }
}
</script>

<style lang="scss">
.container {
  width: 100%;
  --padding: 2rem;
}

#avatar-home {
  .scene-wrapper {
    overflow: hidden;
  }
  .logo-wrapper {
    padding-left: var(--padding);
    padding-right: var(--padding);
    padding-top: var(--padding);
    display: flex;
    .share {
      font-size: 1.8rem;
      letter-spacing: .3rem;
      line-height: 4.5rem;
      margin: 0 2rem;
    }
    img {
      height: 4.5rem;
      width: 4.5rem;
    }
  }

  .raw-avatar {
    margin: var(--padding);
    border: 2px dashed #eee;
    border-radius: 1rem;
    text-align: center;
    padding: 3rem 0;
    img.raw {
      height: 10rem;
      width: 10rem;
    }

    .raw-preview {
      margin: 3rem 0;
      display: flex;
      justify-content: center;
      >div {
        margin: 0 .5rem;
      }
      .size-rect {
        width: 6rem;
        height: 6rem;
        border: 1px solid #eee;
      }
      .size-circle {
        width: 6rem;
        height: 6rem;
        border-radius: 50%;
        border: 1px solid #eee;
      }
      .size-radius-40 {
        width: 6rem;
        height: 6rem;
        border-radius: 40%;
        border: 1px solid #eee;
      }
      .size-radius-20 {
        width: 6rem;
        height: 6rem;
        border-radius: 20%;
        border: 1px solid #eee;
      }
    }
  }
  .work-list-wrapper {
    margin: 20px;
    display: flex;
    li {
      margin: 5px;
    }
  }
}



@media screen and (min-width: 62em) {
  .container {
    width: 100%;
    --padding: 5rem;
  }
  .raw-avatar {
    text-align: left;
    img.raw {
      height: 20rem;
      width: 20rem;
    }
  }
}

</style>