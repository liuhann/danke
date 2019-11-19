<template>
<nav class="element-prop-config">
  <tabs size="is-small" v-model="configTab" :tabs="configTabs"></tabs>
  <div class="basic" v-if="configTab === 'basic'">
    <edit-font v-if="element.font" v-model="element.font" @apply-to-all="applyFontToAll" @copy="copyFontStyle" @paste="pasteFontStyle"></edit-font>
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
          <span class="button is-small" @click="copyElement">元素</span>
          <span class="button is-small" @click="copyPosition">位置</span>
          <span class="button is-small" @click="copyAnimation">动画</span>
        </div>
      </div>
    </div>
    <div class="field has-addons">
      <div class="control field-lb">
        粘贴
      </div>
      <div class="control">
        <div class="buttons has-addons">
          <span class="button is-small" @click="pasteElement">元素</span>
          <span class="button is-small" @click="pastePosition">位置</span>
          <span class="button is-small" @click="pasteAnimation">动画</span>
        </div>
      </div>
    </div>

    <div class="field has-addons">
      <div class="control field-lb">
      </div>
      <div class="control">
        <div class="buttons has-addons">
          <span class="button is-small is-danger" @click="removeElement">删除</span>
        </div>
      </div>
    </div>
  </div>

  <div class="animation" v-if="configTab === 'animation' && element.animation">
    <edit-animation :animation="element.animation.in" label="进入" animation-type="in"/>
    <edit-animation :animation="element.animation.dura" label="持续" animation-type="dura" />
    <edit-animation :animation="element.animation.out" label="离开" animation-type="out" />
  </div>

  <div class="extra" v-if="configTab === 'other'">
    <div class="field has-addons">
      <div class="control field-lb">
        类名
      </div>
      <div class="control">
        <input v-model="element.className" class="input is-small"/>
      </div>
    </div>
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
import EditShadow from './props/EditShadow.vue'
import EditAnimation from './props/EditAnimation.vue'
import { TypeEnum } from '../../danke-core/elements/index'
import { Shapes } from '../../danke-core/css-model/shapeclip'
import EditMask from './props/EditMask.vue'
import EditFilter from './props/EditFilter.vue'
import Tabs from '../../common/components/Tabs.vue'
import EditImage from './props/EditImage.vue'
import { shortid } from '../../utils/string'
import { Message } from 'element-ui'

export default {
  name: 'ElementConfig',
  props: {
    element: {
      type: Object
    },
    scene: {
      type: Object
    },
    work: { // 整个作品对象，这里传入后以便元素样式等方面复制可以直接操作进行
      type: Object
    },
    animations: {
      type: Array
    }
  },
  components: {
    EditImage,
    Tabs,
    EditMask,
    EditAnimation,
    EditSize,
    EditClipPath,
    EditBorder,
    EditBackground,
    EditPosition,
    EditShadow,
    EditFilter,
    EditFont
  },
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

    /**
     * 全面复制整个元素信息
     * */
    copyElement () {
      this.ctx.copiedElement = this.element
    },
    pasteElement () {
      if (this.ctx.copiedElement) {
        const cloned = JSON.parse(JSON.stringify(this.ctx.copiedElement))
        cloned.from = cloned.id
        cloned.id = shortid()
        this.scene.elements.push(cloned)
      }
      Message.info('元素已经粘贴')
    },
    /**
     * 复制元素的位置、大小属性
     */
    copyPosition () {
      this.ctx.copiedPosition = this.element
    },

    pastePosition () {
      if (this.ctx.copiedPosition) {
        this.element.position.offsetX = this.ctx.copiedPosition.position.offsetX
        this.element.position.offsetY = this.ctx.copiedPosition.position.offsetY
        this.element.position.horizontal = this.ctx.copiedPosition.position.horizontal
        this.element.position.vertical = this.ctx.copiedPosition.position.vertical
        this.element.size.width = this.ctx.copiedPosition.size.width
        this.element.size.height = this.ctx.copiedPosition.size.height
      }
    },

    /**
     * 复制元素的动画属性，复制内容包括进入、持续、离开动画
     */
    copyAnimation () {
      this.ctx.copiedAnimation = this.element
    },

    pasteAnimation () {
      if (this.ctx.copiedAnimation) {
        this.element.animation = JSON.parse(JSON.stringify(this.ctx.copiedAnimation.animation))
      }
    },

    /**
     * 复制元素的字体属性
     **/
    copyFontStyle () {
      this.ctx.copiedFont = this.element
    },

    pasteFontStyle () {
      this.element.font = JSON.parse(JSON.stringify(this.ctx.copiedFont.font))
    },

    /**
     * 删除元素
     **/
    removeElement () {
      this.$emit('remove')
    },
    /**
     * 应用当前的动画到所有的元素
     * @param stage
     */
    applyAnimationToAll (stage) {

    },

    /**
     * 应用字体配置到作品的所有文字之上
     */
    applyFontToAll () {

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
