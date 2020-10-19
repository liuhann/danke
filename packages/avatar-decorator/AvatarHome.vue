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
        <div class="raw-preview-container">
          <div class="preview size-rect">
            <render-scene v-if="currentWork" :variables="variables" :view-box="currentWork.viewBox" :scale="64/960" :scene="currentWork.scenes[0]" :view-port="currentWork.viewBox" :stage="currentWork.stage" />
            <img v-else class="raw" :src="userAvatar" />
          </div>
          <div class="preview size-circle">
            <render-scene v-if="currentWork" :view-box="currentWork.viewBox" :scale="64/960" :scene="currentWork.scenes[0]" :view-port="currentWork.viewBox" :stage="currentWork.stage" />
            <img v-else class="raw" :src="userAvatar" />
          </div>
          <div class="preview size-radius-20">
            <render-scene v-if="currentWork" :view-box="currentWork.viewBox" :scale="64/960" :scene="currentWork.scenes[0]" :view-port="currentWork.viewBox" :stage="currentWork.stage" />
            <img v-else class="raw" :src="userAvatar" />
          </div>
          <div class="preview size-radius-40">
            <render-scene v-if="currentWork" :view-box="currentWork.viewBox" :scale="64/960" :scene="currentWork.scenes[0]" :view-port="currentWork.viewBox" :stage="currentWork.stage" />
            <img v-else class="raw" :src="userAvatar" />
          </div>
        </div>
        <div class="variables">
          <div v-for="(variable, index) in variables" :key="index" class="variable">
            <div v-if="variable.type==='color'" class="color-input">
              <input v-model="variable.value" />
              <v-swatches v-model="variable.value" :row-length="width > 400? 6: 5" popover-y="bottom"
                          shapes="circles"
              ></v-swatches>
            </div>
            <div v-if="variable.type==='text'" class="text-input">
              <input v-model="variable.value" />
            </div>
          </div>
        </div>
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
              <render-scene :view-box="work.viewBox" :scale="120/960" :scene="work.scenes[0]" :view-port="work.viewBox" :stage="work.stage" />
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
import VSwatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.css'
import StyleRegistry from '../xd-builder/utils/StyleRegistry'
export default {
  name: "AvatarHome",
  components: {
    [Upload.name]: Upload,
    [Button.name]: Button,
    VSwatches,
    RenderScene
  },
  data () {
    return {
      logo,
      user: this.ctx.user,
      width: 414,
      currentWork: null,
      variables: [],
      viewport: {
        width: 120,
        height: 120
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
    this.width = window.screen.availWidth
  },

  methods: {
    getImageUrl,
    applyDecorator (work) {
      // window.open(`/capture/image/${work.id}`)
      this.currentWork = JSON.parse(JSON.stringify(work))
      this.variables = [];
      for (let element of this.currentWork.scenes[0].elements) {
        if (element.template) {
          if (element.type === 'img') {
            this.variables.push({
              element: element.id,
              type: 'image',
              value: this.userAvatar
            })
          } else if (element.text) {
            this.variables.push({
              element: element.id,
              type: 'text',
              value: element.text
            })
          } else if (element.html) {
            for (let variable of element.variables) {
              this.variables.push({
                variable: true,
                element: element.id,
                type: variable.type,
                value: variable.value
              })
            }
          }
        }
      }
      console.log(this.variables)
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

    .raw-preview-container {
      margin: 3rem 0;
      display: flex;
      justify-content: center;
      .preview {
        width: 64px;
        height: 64px;
        margin: 0px 3px;
        border: 1px solid #eee;
        overflow: hidden;
        >img {
          width: 64px;
          height: 64px;
        }
      }
      .size-circle {
        border-radius: 50%;
      }
      .size-radius-40 {
        border-radius: 40%;
      }
      .size-radius-20 {
        border-radius: 20%;
      }
    }

    .variables {
      .variable {
        box-sizing: border-box;
        padding: 5px 10px;
        width: 100%;
        position: relative;
        text-align: left;
        input {
          box-sizing: border-box;
          appearance: none;
          font-size: 1.8rem;
          height: 4.5rem;
          color:rgb(66,66,66);
          padding-left: 1rem;
          padding-right: 1rem;
          border-radius: 0.5rem;
          border-color: transparent;
          background-color: #f5f5f5;
          border-width: 0.125rem;
          box-shadow: none;
          font-weight: 700;
          width: 80%;
        }

        .color-input {
          .vue-swatches {
            position: absolute;
            right: 20px;
            .vue-swatches__container {
              z-index: 1001;
            }
          }
        }
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