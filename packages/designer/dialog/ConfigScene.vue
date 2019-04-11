<template>
  <el-tabs class="config-work-scene">
    <el-tab-pane label="元素">
      <el-button-group class="tools-bar">
        <el-button size="small" @click.stop="removeSelectedElements">删除</el-button>
        <el-button size="small" @click.stop="cloneSelectedElements">复制</el-button>
        <el-button size="small" @click.stop="clonseSelectedAsTemplate">复制为模板</el-button>
        <el-button size="small" @click.stop="copySelectedElements">粘贴</el-button>
      </el-button-group>
      <el-table :data="scene.elements" :show-header="false">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          prop="title">
        </el-table-column>
        <el-table-column width="120">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-arrow-up" @click="elementUp(scope.$index)"></el-button>
            <el-button type="text" icon="el-icon-arrow-down" @click="elementDown(scope.$index)"></el-button>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="tapElementOn(scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="场景配置">
      <el-button-group class="tools-bar">
        <el-button size="mini" @click="tapAddScene">新增</el-button>
        <el-button size="mini" @click="cloneCurrentScene">新增</el-button>
        <el-button size="mini" @click="movePrev">前移</el-button>
        <el-button size="mini" @click="moveNext">后移</el-button>
        <el-button size="mini" @click="deleteScene">删除场景</el-button>
      </el-button-group>
      <item-block title="名称">
        <van-field v-model="scene.title" clearable autosize></van-field>
      </item-block>
      <item-block title="类型">
        <select v-model="scene.type">
          <option value="slide">普通</option>
          <option value="background">背景</option>
          <option value="foreground">前景</option>
        </select>
      </item-block>
      <item-block title="切换时间" v-if="scene.type === 'slide'">
        <van-stepper v-model="scene.duration" integer disable-input :step="50"/>
      </item-block>
    </el-tab-pane>

    <el-tab-pane label="资源">

    </el-tab-pane>

    <el-tab-pane label="作品配置">
      <el-button-group class="tools-bar">
        <el-button size="mini" @click="previewPlay">播放</el-button>
        <el-button size="mini" @click="saveDraft">保存草稿</el-button>
        <el-button size="mini" @click="saveOtherDraft">另存</el-button>
        <el-button size="mini" @click="returnHome">返回首页</el-button>
      </el-button-group>
      <item-block title="标题">
        <van-field v-if="work" v-model="work.title" required clearable/>
      </item-block>
      <item-block title="描述">
        <van-field v-if="work" v-model="work.desc" type="textarea" clearable/>
      </item-block>
    </el-tab-pane>

    <!--<van-dialog
      v-model="showTemplateName"
      show-cancel-button
      :before-close="templateNameConfirmed">
      <van-field
        v-model="templateName"
        label="模板名称"
      />
    </van-dialog>-->
  </el-tabs>
</template>

<script>
import { shortid } from '../../utils/string'
import { clone } from '../../utils/object'
import TPL_SCENE from '../templates/scene'
import ItemBlock from 'style-editor/src/components/ItemBlock'
export default {
  name: 'ConfigScene',
  components: {
    ItemBlock
  },
  props: {
    scene: {
      type: Object
    },
    work: {
      type: Object
    },
    scenes: {
      type: Array
    },
    sceneIndex: {
      type: Number
    }
  },
  data () {
    return {
      templateName: '',
      showTemplateName: false,
      currentSceneIndex: this.sceneIndex,
      selectedIndexs: [],
      tabConfig: 0
    }
  },
  filters: {
    icon: function (type) {
      switch (type) {
        case 'image':
          return 'photo'
        case 'text':
          return 'edit'
        default:
          return 'app'
      }
    },
    title: function (element) {
      if (element.type === 'image') {
        return element.name || '形状'
      } else if (element.type === 'text') {
        return element.content
      }
    }
  },
  watch: {
    sceneIndex (val) {
      this.currentSceneIndex = val
    }
  },
  created () {
  },

  methods: {
    cloneSelectedElements () {
      const clipData = []
      for (let i = 0; i < this.scene.elements.length; i ++) {
        let element = this.scene.elements[i]
        if (element.checked) {
          element.index = i
          clipData.push(element)
        }
      }
      if (clipData.length) {
        this.ctx.vant.Toast('节点已经复制')
        this.ctx.copiedElements = clipData
      } else {
        this.ctx.vant.Toast('未选择任何节点')
      }
    },

    clonseSelectedAsTemplate () {
      this.cloneSelectedElements()
      if (this.ctx.copiedElements.length) {
        this.showTemplateName = true
      }
    },

    copySelectedElements () {
      if (this.ctx.copiedElements && this.ctx.copiedElements.length) {
        for (let element of this.ctx.copiedElements) {
          const cloned = clone(element)
          cloned.checked = false
          cloned.id = shortid()
          if (cloned.index != null && this.scene.elements.length > cloned.index) {
            const index = cloned.index
            delete cloned.index
            this.scene.elements.splice(index, 0, cloned)
          } else {
            this.scene.elements.push(cloned)
          }
        }
        this.ctx.vant.Toast('复制完成')
      } else {
        this.ctx.vant.Toast('剪切板上无任何节点')
      }
    },

    removeSelectedElements () {
      const clipData = []
      for (let element of this.scene.elements) {
        if (element.checked) {
          clipData.push(element)
        }
      }
      if (clipData.length) {
        this.ctx.vant.Toast('节点已经复制')
        this.ctx.copiedElements = clipData
        console.log(clipData)
      } else {
        this.ctx.vant.Toast('未选择任何节点')
      }
    },

    templateNameConfirmed (action, done) {
      if (action === 'confirm') {
        this.ctx.workdao.saveTemplate(this.templateName, this.ctx.copiedElements).then(done)
        setTimeout(done, 1000);
      } else {
        done();
      }
    },

    tapAddScene () {
      const scene = clone(TPL_SCENE)
      scene.id = shortid()
      scene.title = '场景' + (this.scenes.length + 1)
      this.scenes.splice(this.currentSceneIndex - 1, 0, scene)
      this.currentSceneIndex ++
      this.sceneChange()
    },

    // 复制当前场景并在当前场景后创建新的
    cloneCurrentScene () {
      const cloned = clone(this.scene)
      cloned.title = '场景' + (this.scenes.length + 1)
      this.scenes.splice(this.currentSceneIndex-1, 0, cloned)
      this.currentSceneIndex ++
      this.sceneChange(this.currentSceneIndex)
    },
    //将当前场景向后移动
    moveNext () {
      if (this.currentSceneIndex === this.scenes.length) {
        return
      }
      this.scenes[this.currentSceneIndex - 1] = this.scenes[this.currentSceneIndex]
      this.scenes[this.currentSceneIndex] = this.scene
      this.currentSceneIndex ++
      this.sceneChange(this.currentSceneIndex)
    },

    //当前场景向前移动
    movePrev () {
      if (this.currentSceneIndex === 1) {
        return
      }
      this.scenes[this.currentSceneIndex - 1] = this.scenes[this.currentSceneIndex - 2]
      this.scenes[this.currentSceneIndex - 2] = this.scene
      this.currentSceneIndex --
      this.sceneChange(this.currentSceneIndex)
    },

    deleteScene () {
      if (this.scenes.length === 1) {
        return
      }
      this.scenes.splice(this.currentSceneIndex - 1, 1)
      if (this.currentSceneIndex > 1) {
        this.currentSceneIndex --
      }
      this.sceneChange()
    },

    sceneChange (page) {
      if (page) {
        this.currentSceneIndex  = page
      }
      this.$emit('scene-change', this.currentSceneIndex)
    },
    tapElementOn (index) {
      this.$emit('choose-element', index)
    },

    elementUp (index) {
      if (index === 0) {
        return
      }
      let swap = this.scene.elements[index - 1]
      this.scene.elements[index - 1] = this.scene.elements[index]
      this.scene.elements[index] = swap
      this.scene.elements.splice(0, 0)
    },
    elementDown (index) {
      if (index === this.scene.elements.length - 1) {
        return
      }
      let swap = this.scene.elements[index + 1]
      this.scene.elements[index + 1] = this.scene.elements[index]
      this.scene.elements[index] = swap
      this.scene.elements.splice(0, 0)
    },

    close () {
      this.$emit('close')
    },
    saveDraft () {
      this.ctx.workdao.addOrUpdateWork(Object.assign(this.work, {
        scenes: this.scenes
      }))
    },

    async saveOtherDraft () {
      await this.ctx.workdao.addOrUpdateWork(Object.assign(this.work, {
        id: shortid(),
        scenes: this.scenes
      }))
      this.ctx.vant.Notify({
        message: '另存成功',
        duration: 1000,
        background: '#1989fa'
      });
    },

    previewPlay () {
      this.saveDraft()
      this.ctx.work = this.work
      this.$router.push('/play')
    },

    addByTemplate () {

    },

    saveAsTemplate () {

    },

    returnHome () {
      this.$router.replace('/')
    }
  }
}
</script>

<style lang="less">
.el-table td, .el-table th {
  padding: 0;
}
.config-work-scene {
  background-color: #fff;
}
</style>
