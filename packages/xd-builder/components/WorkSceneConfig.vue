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
      <a @click="previewScene">预览</a>
      <a @click="copyScene"> 复制场景</a>
      <a @click="pasteElement"> 粘贴元素</a>
      <a @click="deleteCurrentScene">删除</a>
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
        <a class="button is-small" @click="showAudioSelection = true">选择</a>
        <a class="button is-small is-primary" @click="openAudioDialog">新增并编辑</a>
      </p>
    </div>

    <div class="tags has-addons" v-if="work.audioName">
      <a class="tag is-link" style="width: 260px;">{{work.audioName}}</a>
      <a class="tag is-delete" @click="clearAudio"></a>
    </div>

    <rest-list v-if="showAudioSelection" rest="danke/audio" :query="{creator: '15011245191'}" column="is-full" @close="showAudioSelection = false">
      <template v-slot:item="{ item }">
        <div class="music-item" @click="chooseAudio(item)">
          <i class="icon-play" />
          <span class="name">{{item.name}}</span>
          <span>{{item.dura}}s</span>
        </div>
      </template>
    </rest-list>
    <div class="field has-addons" v-if="work.audioName">
      <a class="button is-small" @click="applyTicks">应用节拍到场景切换</a>
    </div>
  </div>
  <dialog-audio-tap ref="dialogAudioList" />
</nav>
</template>

<script>
import EditBackground from './props/EditBackground.vue'
import EditAnimation from './props/EditAnimation.vue'
import Tabs from '../../common/components/Tabs.vue'
import DialogAudioTap from './DialogAudioTap.vue'
import RestList from '../../common/components/RestList.vue'
import { Divider } from 'element-ui'
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
    RestList,
    Divider
  },
  inject: ['zoomIn', 'zoomOut', 'previewScene', 'zoom', 'deleteCurrentScene', 'previousScene', 'nextScene', 'clipboard', 'pasteElement', 'copyScene'],
  data () {
    return {
      showAudioSelection: false,
      switchTabs: [{
        key: 'scene',
        title: '场景'
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
      }]
    }
  },
  computed: {
  },
  methods: {
    chooseAudio (audioItem) {
      this.work.audioUrl = audioItem.url
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
    applyTicks () {
      if (this.work.audioTicks) {
        let last = 0
        for (let i = 0; i < this.work.audioTicks.length; i++) {
          if (this.work.scenes[i]) {
            this.work.scenes[i].leave = Math.floor(this.work.audioTicks[i] * 1000) - last
            last = Math.floor(this.work.audioTicks[i] * 1000)
          }
        }
      }
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
}
</style>
