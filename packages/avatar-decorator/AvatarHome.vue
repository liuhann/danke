<template>
  <div id="avatar-home">
    <div class="container">
      <div class="logo-wrapper">
        <img :src="logo" />
        <p class="share">由 <a href="http://danke.fun">蛋壳分享</a> 提供</p>
      </div>
      <div class="raw-avatar">
        <div class="preview-original">
          <render-scene v-if="currentWork" :variables="variables" :view-box="currentWork.viewBox" :scale="96/960" :scene="currentWork.scenes[0]" :view-port="currentWork.viewBox" :stage="currentWork.stage" />
          <img class="raw" :src="userAvatar" @click="requestDownload" />
        </div>
        <div class="raw-preview-container">
          <div class="preview size-radius-10">
            <render-scene v-if="currentWork" :variables="variables" :view-box="currentWork.viewBox" :scale="64/960" :scene="currentWork.scenes[0]" :view-port="currentWork.viewBox" :stage="currentWork.stage" />
            <img v-else class="raw" :src="userAvatar" />
          </div>
          <div class="preview size-radius-20">
            <render-scene v-if="currentWork" :variables="variables" :view-box="currentWork.viewBox" :scale="64/960" :scene="currentWork.scenes[0]" :view-port="currentWork.viewBox" :stage="currentWork.stage" />
            <img v-else class="raw" :src="userAvatar" />
          </div>
          <div class="preview size-radius-30">
            <render-scene v-if="currentWork" :variables="variables" :view-box="currentWork.viewBox" :scale="64/960" :scene="currentWork.scenes[0]" :view-port="currentWork.viewBox" :stage="currentWork.stage" />
            <img v-else class="raw" :src="userAvatar" />
          </div>
          <div class="preview size-circle">
            <render-scene v-if="currentWork" :variables="variables" :view-box="currentWork.viewBox" :scale="64/960" :scene="currentWork.scenes[0]" :view-port="currentWork.viewBox" :stage="currentWork.stage" />
            <img v-else class="raw" :src="userAvatar" />
          </div>
        </div>
        <div class="variables">
          <div v-for="(variable, index) in variables" :key="index" class="variable">
            <div v-if="variable.type==='color'" class="color-input">
              <input v-model="variable.value" />
              <v-swatches v-model="variable.value" :row-length="width > 400? 6: 5" popover-y="bottom" :trigger-style="{
                width: '32px', height: '32px'
              }" shapes="circles"
              />
            </div>
            <div v-if="variable.type==='text'" class="text-input">
              <input v-model="variable.value" />
            </div>
          </div>
        </div>
        <div class="action">
          <el-button @click="$refs.file.click()">
            更换
            <input ref="file" type="file" accept="image/*" @change="uploadImage($event)">
          </el-button>
          <el-button @click="requestDownload">下载</el-button>
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
              <render-scene :view-box="work.viewBox" :scale="viewport.width/960" :scene="work.scenes[0]" :view-port="work.viewBox" :stage="work.stage" />
            </div>
          </li>
        </ul>
      </div>
      <div class="template-category">
      </div>
    </div>
    <div v-show="image" class="avatar-crop-container">
      <div class="avatar-crop">
        <cropper
          ref="cropper"
          class="upload-example-cropper"
          :stencil-props="{
            handlers: {},
            movable: false,
            scalable: false,
            aspectRatio: 1,
          }"
          image-restriction="stencil"
          :default-boundaries="() => ({
            width,
            height: width
          })"
          :src="image"
        />
      </div>
      <div class="action">
        <el-button @click="uploadTempAvatar">
          确定
        </el-button>
        <el-button @click="image = null">取消</el-button>
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
import { Cropper } from 'vue-advanced-cropper'
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
    Cropper,
    RenderScene
  },
  data () {
    return {
      image: null,
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
        return this.getImageUrl(this.user.avatar, 960, 960)
      } else {
        return ''
      }
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    this.followdao = new RestDAO(this.ctx, 'danke/follow')
    this.imagedao = new ImageDAO(this.ctx)
    this.styleRegistry = new StyleRegistry(this.ctx)
  },

  mounted () {
    this.loadWorks()
    this.width = window.screen.availWidth
    this.viewport = {
      width: (this.width - 40) / 3 - 10,
      height: (this.width - 40) / 3 - 10
    }
  },

  methods: {
    getImageUrl,
    uploadImage(event) {
      // Reference to the DOM input element
      const input = event.target;
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        const reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
          // Read image as base64 and set to imageData
          this.image = e.target.result;
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0]);
      }
    },

    uploadTempAvatar () {
      const { canvas } = this.$refs.cropper.getResult();
      if (canvas) {
        const form = new FormData();
        canvas.toBlob(async blob => {
          const result = await this.imagedao.uploadBlob(blob, `profile`)
          await this.ctx.userdao.setAvatar(result.name)
          const user = await this.ctx.userdao.getCurrentUser()
          this.ctx.user = user
          this.user = user
          this.image = null
        })
      }
    },

    async requestDownload () {
      await this.followdao.create({
        id: this.ctx.user.id,
        work: this.currentWork.id,
        variables: this.variables
      })
      const response = await this.ctx.get('danke/avatar/download?id=' + this.ctx.user.id)
      this.downloadFile(this.getImageUrl(response.data.data.url, 640, 640))
    },

    downloadFile(filePath) {
      var link=document.createElement('a');
      link.href = filePath;
      link.download = true
      link.click();
    },

    applyDecorator (work) {
      this.currentWork = JSON.parse(JSON.stringify(work))
      this.variables = [];
      for (let element of this.currentWork.scenes[0].elements) {
        if (element.template) {
          if (element.url) {
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
                name: variable.name,
                type: variable.type,
                value: variable.value
              })
            }
          }
        }
      }
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
    margin-bottom: 5px;
    border: 2px dashed #eee;
    border-radius: 1rem;
    text-align: center;
    padding: 2rem 0;

    .preview-original {
      margin: 0 auto;
      width: 96px;
      height: 96px;
      overflow: hidden;
      >img {
        width: 96px;
        height: 96px;
      }
    }
    img.raw {
      height: 10rem;
      width: 10rem;
    }

    .raw-preview-container {
      margin: 2rem 0 1rem;
      display: flex;
      justify-content: center;
      .preview {
        width: 64px;
        height: 64px;
        margin: 0px 3px;
        overflow: hidden;
        >img {
          width: 64px;
          height: 64px;
        }
      }
      .size-circle {
        border-radius: 50%;
      }
      .size-radius-30 {
        border-radius: 30%;
      }
      .size-radius-20 {
        border-radius: 20%;
      }
      .size-radius-10 {
        border-radius: 10%;
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
          background: transparent;
          -webkit-tap-highlight-color: rgba(0,0,0,0);
          outline: none;
          height: 4.5rem;
          color:rgb(66,66,66);
          padding-left: 1rem;
          padding-right: 1rem;
          border-color: transparent;
          border-width: 0.125rem;
          box-shadow: none;
          font-weight: 700;
        }

        .text-input {
          background-color: #f9f9f9;
          border-radius: 0.5rem;
        }
        .color-input {
          background-color: #f9f9f9;
          border-radius: 0.5rem;
          .vue-swatches {
            position: absolute;
            top: 1.1rem;
            right: 2rem;
            .vue-swatches__container {
              z-index: 1001;
            }
          }
        }
      }
    }
  }

  .action {
    input[type="file"] {
      display: none;
    }
  }

  .title {
    font-size: 1.8rem;
    letter-spacing: .3rem;
    line-height: 4.5rem;
    margin: 0 2rem;
  }
  .work-list-wrapper {
    margin: 0 2rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    li {
      margin: 5px 0;
    }
  }
  .avatar-crop-container {
    position: absolute;
    z-index: 10001;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: #ffffffe0;
    .avatar-crop {
      width: 100vw;
      height: 100vw;
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