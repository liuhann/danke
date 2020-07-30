<template>
  <div id="scene-element-list">
    <draggable v-model="scene.elements" class="list-content">
      <div v-for="element of scene.elements" :key="element.id" class="element-item" :class="element.selected? 'checked': ''" @click="checkElement(element, $event)">
        <div class="element-icon">
          <img v-if="element.url" :src="getImageUrl(element.url)">
          <span v-else-if="element.text">A</span>
          <div v-else class="shape" />
        </div>
        <div class="element-name">
          {{ element.name }}
        </div>
        <div class="actions">
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { getImageUrl } from '../mixins/imageUtils.js'
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

    getImageUrl,
    checkElement (element, event) {
      if (!event.ctrlKey) {
        this.scene.elements.forEach(element => {
          element.selected = false
        })
      }
      element.selected = true
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
      line-height: 3rem;
      position: relative;
      &:hover {
        background: #fefefe;
        cursor: pointer;
      }
      &.checked {
        background: #eee;
        color: rgb(90, 90, 90);
      }
      .element-icon {
        width: 3rem;
        height: 3rem;
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
        position: absolute;
      }
      display: flex;
    }
  }
}
</style>