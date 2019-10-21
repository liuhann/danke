<template>
<div id='y-builder'>
  <div id="device-container" :style="containerStyle">
    <div class="scene" :style="currentScene.style">
      <div v-for="(element, index) of currentScene.elements" :key="element.id" :id="'element-' + element.id"
      class="element" :class="[element.visible?'':'hidden', 'type ' + element.type]" :style="element.style + ';' + 'z-index:' + index + ';'"
        @click="chooseElement(element, $event)">
        <!--图片渲染-->
        <img v-if="element.type === 'image'" :src="element.url" :style="element.innerStyle || ''">
        <!--文本渲染情况下 文本内容-->
        <span v-if="element.type === 'text'" v-html="$options.filters.newline(element.text)"></span>
      </div>
    </div>
    <div class="tools-bar">
      <div class="menu">
        <el-button type="success" plain icon="el-icon-menu" circle></el-button>
      </div>
      <div class="nav">
      </div>
      <div class="add">
        <el-dropdown>
          <el-button type="success" plain icon="el-icon-plus" circle></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-upload
                class="upload-demo"
                action="no"
                :show-file-list="false"
                :on-change='imageChoosed'
                :auto-upload="false">
                <i class="el-icon-edit"></i> 图片
              </el-upload>
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-files">形状</el-dropdown-item>
            <el-dropdown-item icon="el-icon-reading">文字</el-dropdown-item>
            <el-dropdown-item icon="el-icon-mic">音频</el-dropdown-item>
            <el-dropdown-item icon="el-icon-video-camera">视频</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { Button, Icon, Dropdown, DropdownMenu, DropdownItem, Upload, Loading } from 'element-ui'
import { getImageWebUrl, getSceneStyle, getAnimationStyle } from '../danke-core/utils/styles'
import { getElementStyle } from './renders/index'
import { fitBy } from '../danke-core/utils/common'
import SCENE from '../danke-core/elements/scene'
import RestDAO from '../common/dao/restdao'
import ImageDAO from '../common/dao/imagedao'
import { shortid } from '../utils/string'
import interact from 'interactjs'
export default {
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Dropdown.name]: Dropdown,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Upload.name]: Upload
  },
  data() {
    return {
      work: {
        ratio: '9:16',
        id: '',
        title: '',
        categories: [],
        desc: '',
        audioUrl: '',
        audioName: '',
        audioTicks: [],
        scenes: []
      },
      device: {
        width: 100,
        height: 100
      },
      currentScene: {},
      currentElement: null,
    }
  },
  computed: {
    containerStyle () {
      return {
        width: this.device.width + 'px',
        height: this.device.height + 'px'
      }
    }
  },
  filters: {
    newline (val) {
      return val.replace(/\n/g, '<br>')
    }
  },

  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    this.initWork()
  },

  methods: {
    async initWork () {
      if (this.$route.query.id) {

      } else {
        // new work
        this.work.id = shortid()
        this.addNewScene()
        this.currentScene = this.work.scenes[0]
      }
      this.device = fitBy(this.work.ratio, window.innerWidth, window.innerHeight)
    },
    async imageChoosed (file) {
      const loading = Loading.service({
        lock: true,
        text: '正在保存图片',
        fullscreen: true,
        background: 'rgba(255, 255, 255, 0.6)'
      })
      const result = await this.imagedao.uploadBlob(file.raw, this.work.id)
      const img = {
        id: shortid(),
        type: 'image',
        imgPath: result.name,
        left: 0,
        top: 0,
        width: 400,
        height: 320,
        style: '',
        url: URL.createObjectURL(file.raw)
      }
      this.currentScene.elements.push(img)
      this.currentElement = img
      this.currentElement.style = getElementStyle(img)
      loading.close()
    },
    /**
     * 增加新的空白场景
     */
    addNewScene () {
      const scene = JSON.parse(JSON.stringify(SCENE))
      scene.background.colors = [this.currentBackground]
      scene.name = '场景 ' + (this.work.scenes.length + 1)
      scene.id = shortid()
      scene.style = getSceneStyle(scene, this.device)
      this.work.scenes.push(scene)
    },
    chooseElement (element, event) {
      this.currentElement = element
      const builder = this

      if (this.currentInteract) {
        interact(this.currentInteract).unset()
      }
      this.currentInteract = event.currentTarget

      interact(this.currentInteract).draggable({
        onmove: event => {
          builder.currentElement.left += event.dx
          builder.currentElement.top += event.dy
          builder.currentElement.style = getElementStyle(builder.currentElement)
        },
        onend: event => {
          builder.currentElement.left += event.dx
          builder.currentElement.top += event.dy
          builder.currentElement.style = getElementStyle(builder.currentElement)
        }
      }).resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },
        modifiers: [
          // keep the edges inside the parent
          interact.modifiers.restrictEdges({
            outer: 'parent',
            endOnly: true
          })
        ],
        inertia: true
      }).on('resizemove', function (event) {
      }).styleCursor(true)
    }
  }
}
</script>

<style lang="scss">
#y-builder {
  background: #f2f2f1;
  #device-container {
    border-radius: 5px;
    box-shadow: 0 0 0 6px #eee;
    background-color: #fff;
    margin: 0 auto;
    position: relative;
  }
  .tools-bar {
    position: absolute;
    bottom: 5px;
    left: 10px;
    right: 10px;
    display: flex;
    .nav {
      flex: 1
    }
  }
}
</style>