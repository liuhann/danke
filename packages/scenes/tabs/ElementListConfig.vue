<template>
<nav class="panel element-list-config is-small">
  <p class="panel-heading">
    元素列表
  </p>
  <a class="panel-block element-item is-small" v-for="(element, index) of elements" :key="index" @click="toggleElement(element)">
    <input type="checkbox" v-model="element.checked" @click="toggleSelect(element)">
    <div v-if="element.type === TypeEnum.IMAGE" class="image" :style="'background-image: url(' + element.url + ')'"></div>
    <div v-if="element.type === TypeEnum.SHAPE" class="shape" :style="{
        backgroundColor: element.background.colors[0]
      }"></div>
    <div class="element-content animations">
      <div class="element-animation" v-if="element.animation.in" :style="[
          element.animation.in.name ? {
            clipPath: 'polygon(' + Math.floor(((element.animation.in.delay + element.animation.in.duration) * 100)/(maxInDuration * 5)) + '% 0%,'
            + ' 100% 0%,'
            + ' 100% 100%,'
            +  Math.floor(((element.animation.in.delay) * 100)/(maxInDuration * 3)) + '% 100%)'
         }: {}]"></div>
    </div>
    <i :class="element.visible? 'icon-eye': 'icon-eye-off'" @click="toggleElementVisible(element)"></i>
  </a>
  <div class="panel-block level">
    <div class="level-left">
      <div class="level-item">
        <label class="checkbox is-small">
          <input type="checkbox">
          全选
        </label>
      </div>
    </div>
    <div class="level-right">
      <div class="level-item">
        <div class="buttons has-addons">
          <span class="button is-small icon-angle-up" :class="hasSelected?'':'is-static'" @click="upAll"></span>
          <span class="button is-small icon-angle-double-up" :class="hasSelected?'':'is-static'" @click="topAll"></span>
          <span class="button is-small icon-angle-down" :class="hasSelected?'':'is-static'" @click="downAll"></span>
          <span class="button is-small icon-angle-double-down" :class="hasSelected?'':'is-static'" @click="bottomAll"></span>
          <span class="button is-small icon-popup" :class="hasSelected?'':'is-static'" @click="copyAll"></span>
          <span class="button is-small icon-trash " :class="hasSelected?'':'is-static'" @click="deleteAll"></span>
        </div>
      </div>
    </div>
  </div>
</nav>
</template>

<script>
import EditBackground from '../components/EditBackground.vue'
import FormField from '../../common/components/FormField'
import { TypeEnum } from '../../danke-core/elements'
import { MessageBox } from 'element-ui'
import { getMaxDuration } from '../../danke-core/css-model/animation'
import { clone } from '../../utils/object'
import { getLengthDelta } from '../../danke-core/utils/common'
import { getElementStyle } from '../../danke-core/utils/styles'

export default {
  name: 'ElementListConfig',
  components: { FormField, EditBackground },
  props: {
    trigger: {
      type: String
    },
    elements: {
      type: Array
    },
    scene: {
      type: Object
    },
    device: {
      type: Object
    }
  },
  data () {
    return {
      TypeEnum,
      iconSet: {
        [TypeEnum.SHAPE]: 'icon-popup',
        [TypeEnum.TEXT]: 'icon-sort-alphabet'
      },
      selectedElements: []
    }
  },
  computed: {
    hasSelected () {
      return this.selectedElements.length
    },

    maxInDuration () {
      return getMaxDuration(this.elements, 'in') || 1
    },
    maxOutDuration () {
      return getMaxDuration(this.elements, 'out') || 1
    }
  },
  filters: {

  },
  watch: {

  },
  created () {
  },

  methods: {
    toggleElement (element) {
      this.$emit('choose', element)
    },
    toggleChooseAll () {

    },
    toggleSelect (element) {
      this.$set(element, 'checked', !element.checked)
      this.selectedElements = []
      for (let element of this.elements) {
        if (element.checked) {
          this.selectedElements.push(element)
        }
      }
    },
    toggleElementVisible (element) {
      this.$set(element, 'visible', !element.visible)
    },

    upAll () {
      for (let element of this.selectedElements) {
        let i = this.elements.indexOf(element)
        if (i > 0) {
          let c = this.elements[i - 1]
          this.$set(this.elements, i - 1, element)
          this.$set(this.elements, i, c)
        }
      }
    },

    downAll () {
      for (let element of this.selectedElements) {
        let i = this.elements.indexOf(element)
        if (i < this.elements.length - 1) {
          let c = this.elements[i + 1]
          this.$set(this.elements, i + 1, element)
          this.$set(this.elements, i, c)
        }
      }
    },

    topAll () {
      for (let i = 0; i < this.selectedElements.length; i++) {
        let element = this.selectedElements[i]
        let currentOrder = this.elements.indexOf(element)
        if (currentOrder > i) {
          let c = this.elements[i]
          this.$set(this.elements, i, element)
          this.$set(this.elements, currentOrder, c)
        }
      }
    },

    bottomAll () {
      for (let i = 0; i < this.selectedElements.length; i++) {
        let element = this.selectedElements[this.selectedElements.length - 1 - i]
        let currentOrder = this.elements.indexOf(element)
        let c = this.elements[this.elements.length - 1 - i]
        this.$set(this.elements, this.elements.length - 1 - i, element)
        this.$set(this.elements, currentOrder, c)
      }
    },

    deleteAll () {
      MessageBox.confirm('确认删除元素，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let element of this.selectedElements) {
          let currentOrder = this.elements.indexOf(element)
          this.elements.splice(currentOrder, 1)
        }
      })
    },

    copyAll () {
      for (let element of this.selectedElements) {
        const clonedElement = clone(element)
        clonedElement.visible = true
        clonedElement.position.offsetX = getLengthDelta(clonedElement.position.offsetX, 3)
        clonedElement.position.offsetY = getLengthDelta(clonedElement.position.offsetY, 3)
        clonedElement.style = getElementStyle(clonedElement, this.device)
        this.elements.push(clonedElement)
      }
    }
  }
}
</script>

<style lang="scss">
.element-list-config {
  .panel-block {
    padding: 5px;
    height: 31px;
    box-sizing: border-box;
  }
  .element-content {
    height: 100%;
    margin: 0 5px;
    flex: 1;
    .element-animation {
      background-color: #9ec8ee;
      height: 100%;
    }
  }
  .element-item {
    color: #666;
  }
  .image {
    margin-right: 5px;
    width: 20px;
    height: 20px;
    background-size: cover;
  }
  .shape {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
  .multiple-operations {
    display: flex;
    margin-top: .5rem;
  }
}
</style>
