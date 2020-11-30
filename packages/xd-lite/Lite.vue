<template>
  <div id="xd-lite">
    <mobile-edit-container v-if="work && scene" :scene="scene" :work="work" />
    <el-drawer :visible.sync="mainDrawerShow" title="我嵌套了表格!" size="60%" :show-close="false">
      <el-menu @select="menuSelected">
        <el-menu-item :index="MENU_SAVE">
          <i class="el-icon-menu"></i>
          <span slot="title">保存</span>
        </el-menu-item>
        <el-menu-item :index="MENU_SCENE_LIST">
          <i class="el-icon-menu"></i>
          <span slot="title">场景列表</span>
        </el-menu-item>
        <el-menu-item :index="MENU_WORK_CONFIG">
          <i class="el-icon-menu"></i>
          <span slot="title">作品配置</span>
        </el-menu-item>
      </el-menu>
    </el-drawer>
    <el-dialog
      title="插入新的元素"
      :visible.sync="dialogVisible"
      width="90%"
    >
    </el-dialog>
    <el-button id="add-button" circle type="primary" icon="el-icon-plus" @click="openInsertDialog"></el-button>
    <el-button id="menu-button" circle icon="el-icon-plus" @click="mainHold"></el-button>
  </div>
</template>

<script>
import MobileEditContainer from './MobileEditContainer'
import workMixin from '../xd-builder/mixins/workMixin'
import StyleRegistry from '../xd-builder/utils/StyleRegistry'
import Vue from 'vue'

import { Drawer, Menu, MenuItem, Button, Dialog, Form, FormItem, ColorPicker, ButtonGroup, Slider, InputNumber } from 'element-ui'

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
  components: { MobileEditContainer },
  mixins: [workMixin],
  data () {
    return {
      mainDrawerShow: false,
      scene: null,
      work: null,
      MENU_SAVE: 0,
      MENU_SCENE_LIST: 1,
      dialogVisible: false,
      MENU_WORK_CONFIG: 2
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
      this.dialogVisible = true
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
  right: 20px;
  top: 20px;
  z-index: 101;
}
#add-button {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 101;
}
</style>