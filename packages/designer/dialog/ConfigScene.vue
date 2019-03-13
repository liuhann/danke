<template>
  <van-tabs v-model="tabConfig" class="config-work-scene">
    <van-tab title="元素">
      <van-cell-group v-if="scene">
        <van-cell v-for="(element, index) in scene.elements" :key="element.id" :title="element | title" :icon="element.type | icon"
                  @click="tapElementOn(index)">
          <div class="right-icon">
            <van-button plain size="small" @click.stop="removeElement(index)">删除</van-button>
            <van-button plain size="small" @click.stop="cloneElement(index)">复制</van-button>
          </div>
        </van-cell>
      </van-cell-group>
    </van-tab>
    <van-tab title="场景配置">
      <van-pagination
        v-model="currentSceneIndex"
        :show-page-size="4"
        :page-count="scenes.length"
        prev-text="上一场景"
        next-text	="下一场景"
        @change="sceneChange"
      />

      <div class="tools-bar">
        <van-button size="small" @click="tapAddScene">新增</van-button>
        <van-button size="small" @click="addByTemplate">从模板新建</van-button>
        <van-button size="small" @click="cloneCurrentScene">复制新建</van-button>
        <van-button size="small" @click="saveAsTemplate">保存为模板</van-button>
      </div>

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
      <edit-background v-model="scene.background"></edit-background>
      <div class="tools-bar">
        <van-button size="small" @click="deleteScene" type="danger">删除场景</van-button>
        <van-button size="small" @click="movePrev">向前移动</van-button>
        <van-button size="small" @click="moveNext">向后移动</van-button>
      </div>
    </van-tab>

    <van-tab title="资源">

    </van-tab>

    <van-tab title="作品配置">
      <item-block title="标题">
        <van-field v-if="work" v-model="work.title" required clearable/>
      </item-block>
      <div class="tools-bar">
        <van-button size="small" type="primary" @click="previewPlay">播放</van-button>
        <van-button size="small" type="primary" @click="saveDraft">保存草稿</van-button>
        <van-button size="small" type="primary" @click="saveOtherDraft">另存</van-button>
      </div>
    </van-tab>


  </van-tabs>
</template>

<script>
import { shortid } from '../../utils/string'
import { clone } from '../../utils/object'
import ItemBlock from '../forms/ItemBlock'
import EditBackground from '../forms/EditBackground'
import TPL_SCENE from '../templates/scene'
export default {
  name: 'ConfigScene',
  components: {
    EditBackground,
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
      currentSceneIndex: this.sceneIndex,
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

  },
  created () {
  },

  methods: {
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
      this.currentSceneIndex --
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

    }
  }
}
</script>

<style lang="less">
.config-work-scene {
  background-color: #fff;
  .tools-bar {
    margin: 8px;
    padding: 5px;
  }
  .van-cell__title {
    height:24px;
    overflow: hidden;
  }
}
</style>
