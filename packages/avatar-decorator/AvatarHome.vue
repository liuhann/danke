<template>
  <div id="avatar-home">
    <nav-bar></nav-bar>
    <section class="section">
      <div class="columns is-mobile is-multiline work-list">
        <div class="column is-3-desktop is-full-mobile">
          <div class="raw-avatar">
            <div id="preview-original" class="preview-original" @click="dialogConfig">
              <img class="raw" :src="userAvatar" crossOrigin="anonymous" />
              <img v-if="currentWork" :src="getImageUrl(currentWork.snapshot, 480, 480)" crossOrigin="anonymous" />
            </div>
            <div class="raw-preview-container">
              <div class="preview size-radius-10">
                <img class="raw" :src="userAvatar" />
                <img v-if="currentWork" :src="getImageUrl(currentWork.snapshot, 240, 240)" />
              </div>
              <div class="preview size-radius-20">
                <img class="raw" :src="userAvatar" />
                <img v-if="currentWork" :src="getImageUrl(currentWork.snapshot, 240, 240)" />
              </div>
              <div class="preview size-radius-30">
                <img class="raw" :src="userAvatar" />
                <img v-if="currentWork" :src="getImageUrl(currentWork.snapshot, 240, 240)" />
              </div>
              <div class="preview size-circle">
                <img class="raw" :src="userAvatar" />
                <img v-if="currentWork" :src="getImageUrl(currentWork.snapshot, 240, 240)" />
              </div>
            </div>
            <div class="variables" style="display: none;">
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
            <div class="action buttons is-centered">
              <button class="button is-primary" @click="$refs.file.click()">
                更换图片
                <input ref="file" type="file" accept="image/*" @change="uploadImage($event)">
              </button>
              <button class="button" @click="requestDownload">保存</button>
            </div>
          </div>
        </div>
        <div class="column is-9-desktop is-full-mobile">
          <h2 class="subtitle mb-3">
            最新
          </h2>
          <div class="columns is-mobile is-multiline is-1 is-variable">
            <div v-for="work in recents" :key="work._id" class="column is-one-quarter-mobile">
              <div class="work-wrapper" @click="applyDecorator(work)">
                <img :src="getImageUrl(work.snapshot, 240, 240)" />
              </div>
            </div>
          </div>
          <ul class="work-list-wrapper">
          </ul>
        </div>
      </div>
    </section>
    <div v-show="showCanvas" id="canvas-area">
      <img class="raw" :src="userAvatar" crossOrigin="anonymous" />
      <img v-if="currentWork" :src="getImageUrl(currentWork.snapshot, 480, 480)" crossOrigin="anonymous" />
    </div>
    <div v-show="image" class="avatar-crop-container">
      <div class="avatar-crop" :style="{
        width: width + 'px',
        height: width + 'px'
      }"
      >
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
      <div class="buttons mt-6">
        <button class="button is-primary" :class="cropping? 'is-loading': ''" @click="uploadTempAvatar">确定</button>
        <button class="button is-light" @click="image = null">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import RestDAO from '../utils/restdao'
import { Upload, Button } from 'element-ui'
import logo from './D.png'
import { getImageUrl } from '../xd-builder/mixins/imageUtils'
import ImageDAO from '../utils/imagedao'
import NavBar from '../site/components/NavBar'
import { Cropper } from 'vue-advanced-cropper'
import html2canvas from 'html2canvas'
import VSwatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.css'
import StyleRegistry from '../xd-builder/utils/StyleRegistry'
export default {
  name: "AvatarHome",
  components: {
    [Upload.name]: Upload,
    [Button.name]: Button,
    VSwatches,
    NavBar,
    Cropper,
  },
  data () {
    return {
      image: null,
      logo,
      user: this.ctx.user,
      width: 414,
      currentWork: null,
      cropping: false,
      variables: [],
      showCanvas: false,
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
        return this.getImageUrl(this.user.avatar, 480, 480)
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
    if (this.width > 480) {
      this.width = 480
    }
    this.viewport = {
      width: (this.width - 40) / 3 - 10,
      height: (this.width - 40) / 3 - 10
    }
  },

  methods: {
    getImageUrl,
    dialogConfig () {
      
    },
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
          this.cropping = true
          const result = await this.imagedao.uploadBlob(blob, `profile`)
          await this.ctx.userdao.setAvatar(result.name)
          const user = await this.ctx.userdao.getCurrentUser()
          this.ctx.user = user
          this.user = user
          this.image = null
          this.cropping = false
        })
      }
    },

    async requestDownload () {
      /*
      this.showCanvas = true
      this.$nextTick(() => {
        html2canvas(document.querySelector('#canvas-area'), {
          useCORS: true,
          scale: 1
        }).then(canvas => {
          this.showCanvas = false
          this.saveAs(canvas.toDataURL(), 'avatar.png');
        });
      })
       */
      window.open(`http://www.danke.fun/api/danke/image/merge?top=${this.getImageUrl(this.currentWork.snapshot, 480, 480)}&bottom=${this.getImageUrl(this.user.avatar, 480, 480)}&width=480&height=480`, '_blank')
    },

    saveAs(uri, filename) {
      const link = document.createElement('a');

      if (typeof link.download === 'string') {
        link.href = uri;
        link.download = filename;
        //Firefox requires the link to be in the body
        document.body.appendChild(link);
        //simulate click
        link.click();
        //remove the link when done
        document.body.removeChild(link);
      } else {
        window.open(uri);
      }
    },

    downloadFile(filePath) {
      var link = document.createElement('a');
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

    async loadWorks () {
      const result = await this.workdao.list(Object.assign({
        channels: 'avatar',
        page: this.page,
        count: this.count
      }))
      this.recents = result.list
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
// 预览区
#canvas-area {
  position: relative;
  width: 480px;
  height: 480px;
  >img {
    position: absolute;
    left: 0;
    top: 0;
    width: 480px;
    height: 480px;
  }
}
#avatar-home {
  .raw-avatar {
    padding: 2rem 0;
    border: 2px dashed #eee;
    border-radius: 1rem;
    text-align: center;
    .preview-original {
      margin: 0 auto;
      width: 96px;
      height: 96px;
      overflow: hidden;
      position: relative;
      >img {
        position: absolute;
        left: 0;
        top: 0;
        width: 96px;
        height: 96px;
      }
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
        position: relative;
        >img {
          position: absolute;
          left: 0;
          top: 0;
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

  .work-wrapper {
    background-color: #fff;
    background-image: linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef),
    linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef);
    background-size: 20px 20px;
    background-position: 0 0, 10px 10px;
    width: 64px;
    height: 64px;
    border: 1px solid #eee;
    border-radius: 2px;
  }

  .action {
    input[type="file"] {
      display: none;
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
  }
}

@media screen and (min-width: 720px) {
  #avatar-home {
    .work-wrapper {
      width: 140px;
      height: 140px;
    }
    .raw-avatar {
      border: 2px dashed #eee;
      border-radius: 1rem;
      text-align: center;
      padding: 2rem 0;
    }
  }

}


</style>