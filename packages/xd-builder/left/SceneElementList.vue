<template>
  <div id="scene-element-list">
    <div class="pop-title">
      <span class="text">元素列表</span>
      <a class="btn-close"><i class="el-icon-close" /></a>
    </div>
    <draggable v-model="scene.elements" class="list-content">
      <div v-for="element of scene.elements" :key="element.id" class="element-item" :class="element.selected? 'checked': ''" @click="checkElement(element, $event)">
        <div class="element-icon" :style="elementVariables(element)">
          <img v-if="element.url" :src="getImageUrl(element.url)">
          <span v-else-if="element.text">A</span>
          <div v-else class="shape" :style="element.style" />
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
import { getImageUrl } from '../mixins/imageUtils.js'
import { assignVariables } from '../mixins/renderUtils'
export default {
  name: 'SceneElementList',
  components: {
    draggable
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
  .list-content {
    width: 100%;
    .element-item {
      padding: 1rem;
      line-height: 2.5rem;
      position: relative;
      border-bottom: 1px solid #eee;
      &:hover {
        background: #fefefe;
        cursor: pointer;
      }
      &.checked {
        background: #eee;
        color: rgb(90, 90, 90);
      }
      .element-icon {
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .shape {
          border: 1px solid #ccc;
          width: 2rem;
          height: 2rem;
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
          padding: 0 5px;
          font-size: 1.5rem;
          color: #666;
        }
      }
      display: flex;
    }
  }
}
</style>