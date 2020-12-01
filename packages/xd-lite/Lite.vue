<template>
  <div id="xd-lite">
    <mobile-edit-container v-if="work && scene" :scene="scene" :work="work" />
    <el-drawer :visible.sync="mainDrawerShow" title="配置" size="80%" :show-close="false">
      <el-menu @select="menuSelected">
        <el-menu-item :index="MENU_SAVE">
          <i class="el-icon-check"></i>
          <span slot="title">保存</span>
        </el-menu-item>
        <el-menu-item :index="MENU_SCENE_LIST">
          <i class="el-icon-s-grid"></i>
          <span slot="title">场景列表</span>
        </el-menu-item>
        <el-menu-item :index="MENU_WORK_CONFIG">
          <i class="el-icon-setting"></i>
          <span slot="title">作品配置</span>
        </el-menu-item>
      </el-menu>
    </el-drawer>
    <el-drawer title="插入新的元素" :visible.sync="insertDrawerShow" size="80%">
      <el-menu @select="insertSelected">
        <el-menu-item :index="INSERT_IMG">
          <i class="el-icon-picture-outline"></i>
          <span slot="title">图片</span>
        </el-menu-item>
        <el-menu-item :index="INSERT_VECTOR">
          <i class="el-icon-picture-outline-round"></i>
          <span slot="title">矢量插图</span>
        </el-menu-item>
        <el-menu-item :index="INSERT_TEXT">
          <i class="el-icon-document"></i>
          <span slot="title">文本内容</span>
        </el-menu-item>
        <el-menu-item :index="INSERT_SHAPE">
          <i class="el-icon-news"></i>
          <span slot="title">形状</span>
        </el-menu-item>
      </el-menu>
    </el-drawer>
    <dialog-insert-vector :show.sync="insertVector"></dialog-insert-vector>
    <button id="add-button" class="button is-success is-medium" @click="openInsertDialog">
      <span class="icon">
        <i class="el-icon-plus"></i>
      </span>
    </button>
    <button id="menu-button" class="button" @click="mainHold">
      <span class="icon">
        <i class="el-icon-setting"></i>
      </span>
    </button>
  </div>
</template>

<script>
import MobileEditContainer from './MobileEditContainer'
import workMixin from '../xd-builder/mixins/workMixin'
import StyleRegistry from '../xd-builder/utils/StyleRegistry'
import Vue from 'vue'

import { Drawer, Menu, MenuItem, Button, Dialog, Form, FormItem, ColorPicker, ButtonGroup, Slider, InputNumber } from 'element-ui'
import DialogInsertVector from './insert/DialogInsertVector'

Vue.use(Drawer)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(ColorPicker)
Vue.use(Slider)
Vue.use(ButtonGroup)
Vue.use(InputNumber)

export default {
  name: "Lite",
  components: { DialogInsertVector, MobileEditContainer },
  mixins: [workMixin],
  data () {
    return {
      mainDrawerShow: false,
      insertDrawerShow: false,
      scene: null,
      work: null,
      MENU_SAVE: '0',
      MENU_SCENE_LIST: '1',
      MENU_WORK_CONFIG: '2',
      INSERT_IMG: 0,
      INSERT_VECTOR: 1,
      INSERT_TEXT: 2,
      INSERT_SHAPE: 3,
      INSERT_AUDIO: 4,
      insertVector: false
    }
  },
  mounted () {
    this.ctx.styleRegistry = new StyleRegistry(this.ctx)
    this.onMounted()
  },

  methods: {
    async onMounted () {
      let workId = this.$route.query.work
      if (!workId) {
        this.work = this.newWork({
          width: this.$route.query.width,
          height: this.$route.query.height
        })
        this.addScene()
      } else {
        await this.loadWork(workId)
        this.scene = this.work.scenes[0]
      }
    },

    insertSelected (index) {
      this.insertDrawerShow = false
      this.insertVector = true
    },

    menuSelected (index) {
      switch (index) {
        case this.MENU_SAVE:
          this.saveWork()
          break;
        default:
          break;
      }
      console.log(index)
    },

    mainHold () {
      this.mainDrawerShow = true
    },

    openInsertDialog () {
      this.insertDrawerShow = true
    }
  }

}
</script>

<style>
#xd-lite {
  height: 100%;
  -webkit-user-select: none;
}

#menu-button {
  position: absolute;
  right: 1rem;
  top: 1rem;
  border-radius: 20rem;
  z-index: 101;
}
#add-button {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  border-radius: 20rem;
  z-index: 101;
}
</style>