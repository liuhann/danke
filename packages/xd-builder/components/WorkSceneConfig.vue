<template>
<nav class="scene-config">
  <tabs size="is-small" v-model="rootTab" :tabs="switchTabs" />
  <div class="scene-props" v-if="rootTab === 'scene'">
    <div class="field has-addons">
      <p class="control field-lb">
        名称
      </p>
      <p class="control">
        <input class="input is-small" style="width: 220px;" v-model="scene.name">
      </p>
    </div>
    <div class="field has-addons">
      <p class="control field-lb">
        切换
      </p>
      <p class="control">
        <input class="input is-small" :disabled="scene.manual" v-model="scene.leave">
      </p>
      <p class="control">
        <a class="button is-small">
          <input type="checkbox" v-model="scene.manual">
          手动
        </a>
      </p>
    </div>
    <div class="field has-addons">
      <p class="control field-lb">
        层次
      </p>
      <p class="control">
        <input class="input is-small" style="width: 220px;" v-model="scene.z">
      </p>
    </div>
    <edit-background v-model="scene.background"></edit-background>
    <divider content-position="right">动画效果</divider>
    <tabs size="is-small" v-model="animationType" :tabs="animationTabs"></tabs>
    <edit-animation :animation="scene.animation[animationType]" :animation-type="animationType"></edit-animation>
    <divider></divider>
    <div class="scene-buttons">
      <a class="button is-small" @click="copyScene">复制场景</a>
      <a class="button is-small is-danger" @click="$emit('delete-scene')">删除</a>
    </div>
  </div>
  <div class="element-list" v-if="rootTab === 'elements'">
    <div class="element" v-for="element in scene.elements" :key="element.id" @click="chooseElement(element)">
      <div class="name">{{element.name}}</div>
      <div class="type">{{element.type}}</div>
    </div>
  </div>
  <div class="work-props" v-if="rootTab === 'work'">
    <div class="field has-addons">
      <p class="control field-lb">
        名称
      </p>
      <p class="control">
        <input class="input is-small" style="width: 220px;" v-model="work.name">
      </p>
    </div>
    <div class="field has-addons">
      <p class="control field-lb">
        分类信息
      </p>
      <p class="control">
        <input class="input is-small" style="width: 220px;" v-model="work.categories">
      </p>
    </div>
    <div class="field has-addons" style="height: 70px;">
      <p class="control field-lb">
        描述
      </p>
      <p class="control">
         <textarea class="input is-small" style="height: 64px;width: 220px;" v-model="work.desc"></textarea>
      </p>
    </div>
    <div class="field has-addons">
      <p class="control field-lb">
        背景音频
      </p>
      <p class="control buttons has-addons is-small">
        <a class="button is-small is-primary" @click="openAudioDialog">新增并编辑</a>
      </p>
    </div>

    <div class="tags has-addons" v-if="work.audioName">
      <a class="tag is-link" style="width: 260px;">{{work.audioName}}</a>
      <a class="tag is-delete" @click="clearAudio"></a>
    </div>

    <div class="field has-addons" v-if="work.audioName">
      <a class="button is-small" @click="editTicks">播放并编辑节拍</a>
    </div>
  </div>
  <dialog-audio-tap ref="dialogAudioList" @audio="chooseAudio"/>
</nav>
</template>

<script>
import EditBackground from './props/EditBackground.vue'
import EditAnimation from './props/EditAnimation.vue'
import Tabs from '../../common/components/Tabs.vue'
import DialogAudioTap from './DialogAudioTap.vue'
import { Divider, MessageBox } from 'element-ui'
import { clone } from '../../utils/object'
import { shortid } from '../../utils/string'
import { getSceneStyle } from '../../danke-core/utils/styles'
export default {
  name: 'WorkSceneConfig',
  props: {
    scene: {
      type: Object
    },
    work: {
      type: Object
    }
  },
  components: {
    DialogAudioTap,
    EditBackground,
    EditAnimation,
    Tabs,
    Divider
  },
  data () {
    return {
      switchTabs: [{
        key: 'scene',
        title: '场景'
      }, {
        key: 'elements',
        title: '列表'
      }, {
        key: 'work',
        title: '作品'
      }],
      rootTab: 'scene',
      animationType: 'in',
      animationTabs: [{
        title: '进入',
        key: 'in'
      }, {
        title: '持续',
        key: 'dura'
      }, {
        title: '离开',
        key: 'out'
      }],
      ticksEditing: false
    }
  },
  computed: {
  },
  methods: {
    chooseAudio (audioItem) {
      this.work.audioUrl = audioItem.audioUrl
      this.work.audioName = audioItem.name
      this.work.audioTicks = audioItem.ticks
    },
    clearAudio () {
      this.work.audioUrl = ''
      this.work.audioName = ''
      this.work.audioTicks = ''
    },
    openAudioDialog () {
      this.$refs.dialogAudioList.open(this.work)
    },
    chooseElement (element) {
      this.$emit('choose-element', element)
    },
    editTicks () {
      this.$emit('edit-tick')
    },
    copyScene () {
      const scene = clone(this.currentScene)
      scene.name = '场景 ' + (this.work.scenes.length + 1)
      scene.id = shortid()
      scene.style = getSceneStyle(scene, this.device)
      this.work.scenes.push(scene)
      this.chooseScene(scene)
    }
  }
}
</script>

<style lang="scss">
.scene-config {
  padding: 10px;
  .form-title {
    padding-bottom: .3rem;
    margin-bottom: .5rem;
    border-bottom: 1px solid #eee;
    display: flex;
    .text {
      flex: 1;
    }
  }
  .scene-buttons {
    font-size: 12px;
    color: #333;
    a {
      margin-right: 10px;
    }
  }

  .audio-playing {
    background-color: #47b17c17;
    color: #47b17c;
    font-size: 12px;
    line-height: 40px;
    height: 40px;
  }
  .music-item {
    display: flex;
    font-size: 12px;
    &:hover {
      background: #eee;
      cursor: pointer;
    }
    .name {
      flex: 1;
      margin: 0 5px;
    }
  }
  .element-list {
    .element {
      display: flex;
      font-size: 12px;
      border-bottom: 1px solid #efefef;
      padding: 5px 5px;
      .name {
        flex: 1;
      }
      &:hover {
        background: #fcfcfc;
        cursor: pointer;
      }
    }
  }
}
</style>
