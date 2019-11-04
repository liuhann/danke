<template>
<nav class="element-prop-config">
  <tabs size="is-small" v-model="configTab" :tabs="configTabs"></tabs>
  <div class="basic" v-if="configTab === 'basic'">
    <edit-font v-if="element.font" v-model="element.font"></edit-font>
    <edit-image v-if="element.url" v-model="element.url" @blob="imageUpdated"></edit-image>
    <edit-background v-model="element.background" v-if="element.background"></edit-background>
    <edit-position v-model="element.position"></edit-position>
    <edit-size v-model="element.size"></edit-size>

    <div class="field has-addons">
      <div class="control field-lb">
        层次
      </div>
      <div class="control">
        <div class="buttons has-addons">
          <span class="button is-small" @click="moveDown(element)">
            向下
          </span>
          <span class="button is-small" @click="moveUp(element)">
            向上
          </span>
          <span class="button is-small" @click="moveBottom(element)">
            最底层
          </span>
          <span class="button is-small" @click="moveTop(element)">
            最顶层
          </span>
        </div>
      </div>
    </div>

    <div class="field has-addons">
      <div class="control field-lb">
        复制
      </div>
      <div class="control">
        <div class="buttons has-addons">
          <span class="button is-small" @click="copyElement(element)">
            复制
          </span>
          <span class="button is-small" @click="copyStyle">仅样式</span>
          <span class="button is-small">样式粘贴</span>
        </div>
      </div>
    </div>
  </div>

  <div class="animation" v-if="configTab === 'animation'">
    <edit-animation :animation="element.animation.in" animation-type="in" />
    <edit-animation :animation="element.animation.dura" animation-type="dura" />
    <edit-animation :animation="element.animation.out" animation-type="out" />
    <div class="field has-addons">
      <div class="control field-lb">
        复制样式
      </div>
      <div class="control">
        <span class="button is-small" @click="copyAnimation">复制</span>
      </div>
      <div class="control">
        <span class="button is-small" @click="pasteAnimation">粘贴</span>
      </div>
    </div>
  </div>

  <div class="extra" v-if="configTab === 'other'">
    <edit-border v-model="element.border" v-if="element.border"></edit-border>
    <edit-shadow v-model="element.shadow" v-if="element.shadow"></edit-shadow>
    <edit-mask v-model="element.mask" v-if="element.mask"></edit-mask>
    <edit-filter v-model="element.filter" v-if="element.filter" />
    <edit-clip-path v-model="element.clip" v-if="element.clip"></edit-clip-path>
  </div>
</nav>
</template>
<script>
import EditFont from './props/EditFont.vue'
import EditPosition from './props/EditPosition.vue'
import EditBackground from './props/EditBackground.vue'
import EditBorder from './props/EditBorder.vue'
import EditClipPath from './props/EditClipPath.vue'
import EditSize from './props/EditSize.vue'
import EditTransform from './props/EditTransform.vue'
import EditShadow from './props/EditShadow.vue'
import EditAnimation from './props/EditAnimation.vue'
import { TypeEnum } from '../../danke-core/elements/index'
import { Shapes } from '../../danke-core/css-model/shapeclip'
import EditMask from './props/EditMask.vue'
import EditFilter from './props/EditFilter.vue'
import Tabs from '../../common/components/Tabs.vue'
import { Divider } from 'element-ui'
import EditImage from './props/EditImage.vue'

export default {
  name: 'ElementConfig',
  props: {
    element: {
      type: Object
    },
    animations: {
      type: Array
    }
  },
  components: {
    EditImage,
    Divider,
    Tabs,
    EditMask,
    EditAnimation,
    EditTransform,
    EditSize,
    EditClipPath,
    EditBorder,
    EditBackground,
    EditPosition,
    EditShadow,
    EditFilter,
    EditFont
  },
  inject: ['moveUp', 'moveDown', 'moveTop', 'moveBottom', 'clipboard', 'cutElement', 'copyElement', 'pasteElement'],
  data () {
    return {
      configTab: 'basic',
      animationType: 'in',
      shapeOptions: Shapes,
      TypeEnum,
      fileUrl: ''
    }
  },
  computed: {
    animationTabs () {
      return [{
        title: '入场动画',
        key: 'in'
      }, {
        title: '持续',
        key: 'dura'
      }, {
        title: '离开',
        key: 'out'
      }]
    },
    configTabs () {
      return [{
        title: '基础',
        key: 'basic'
      }, {
        title: '动画',
        key: 'animation'
      }, {
        title: '其他',
        key: 'other'
      }]
    }
  },
  watch: {
    element: {
      deep: true,
      handler () {
        this.$emit('element-change')
      }
    }
  },
  methods: {
    imageUpdated (file) {
      this.element.blob = file
    },

    copyAnimation () {
      this.ctx.animationCopied = JSON.parse(JSON.stringify(this.element.animation))
    },

    pasteAnimation () {
      if (this.ctx.animationCopied) {
        this.element.animation = this.ctx.animationCopied
      }
    },

    copyStyle () {

    },
    pasteStyle () {

    }
  }
}
</script>

<style lang="scss">
.element-prop-config {
  padding: 10px;
  .form-title {
    padding-bottom: .3rem;
    margin-bottom: .5rem;
    border-bottom: 1px solid #eee;
    display: flex;
    .text {
      flex: 1;
    }
    .opers {
      font-size: 14px;
      display: flex;
      width: 80px;
      justify-content: space-between;
      color: #333;
      .icon-paste {
        color: #999;
        &.has-clipboard {
          color: #333;
        }
      }
    }
  }
}
</style>
