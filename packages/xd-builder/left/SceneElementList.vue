<template>
  <div id="scene-element-list">
    <div class="pop-title">
      <h3 class="subtitle is-5">元素列表</h3>
      <a class="btn-close" @click="$emit('close')"><i class="el-icon-circle-close" /></a>
    </div>
    <draggable v-model="scene.elements" class="list-content">
      <div v-for="element of scene.elements" :key="element.id" class="element-item" :class="element.selected? 'checked': ''" @click="checkElement(element, $event)">
        <div class="element-icon">
          <render-element :element="element" :view-port="{width: 24, height: 24}" />
        </div>
        <div class="element-name">
          {{ element.text || element.name }}
        </div>
        <div class="actions">
          <a class="btn" @click="removeElement(element)"><i class="el-icon-delete" /></a>
          <a v-if="!element.locked" class="btn" @click="lockElement(element)"><i class="el-icon-lock" /></a>
          <a v-if="element.locked" class="btn" @click="unlockElement(element)"><i class="el-icon-unlock" /></a>
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { getImageUrl } from '../../utils/getImageUrl.js'
import { assignVariables } from '../mixins/renderUtils'
import RenderElement from '../render/RenderElement.vue'
export default {
  name: 'SceneElementList',
  components: {
    draggable,
    RenderElement
  },
  props: {
    scene: {
      type: Object
    }
  },
  computed: {
    checkedElements () {
      return this.scene.elements.filter( e => e.selected)
    }
  },
  methods: {
    process (step) {
      return {
        left: (step.range[0] / this.scene.duration * 100) + '%',
        width: (step.range[1] / this.scene.duration * 100) + '%'
      }
    },

    removeElement (element) {
      this.scene.elements.splice(this.scene.elements.indexOf(element), 1)
    },
    /**
     * 元素锁定的规则：
     * 可以选中，但是不能调整大小、移动 不能被多选
     */
    lockElement (element) {
      this.$set(element, 'locked', true)
    },

    unlockElement (element) {
      this.$set(element, 'locked', false)
    },

    elementVariables(element) {
      const style = {}
      assignVariables(style, element.variables)
      return style
    },

    getImageUrl,
    checkElement (element, event) {
      if (!event.ctrlKey) {
        this.scene.elements.forEach(element => {
          element.selected = false
        })
      }
      element.selected = !element.selected
    }
  }
}
</script>

<style lang="scss">
#scene-element-list {
  background: white;
  width: 100%;
  .pop-title {
    padding: 10px;
    border-bottom: 1px solid #ede;
    display: flex;
    .subtitle {
      flex: 1;
    }
  }
  .list-content {
    width: 100%;
    .element-item {
      position: relative;
      border-bottom: 1px solid #eee;
      &:hover {
        background: #efefef;
        cursor: pointer;
      }
      &.checked {
        background: #efefef;
        color: rgb(90, 90, 90);
      }
      .element-icon {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        .element {
          position: inherit;
        }
      }
      .element-name {
        margin: 0 1rem;
        flex: 1;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .actions {
        .btn {
          padding: 10px;
          line-height: 36px;
          font-size: 16px;
          color: #666;
        }
      }
      display: flex;
    }
  }
}
</style>