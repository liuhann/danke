<template>
  <el-popover
    placement="bottom-start"
    width="240"
    title="元素列表"
    trigger="click"
  >
    <a slot="reference" class="action"><icon-list /></a>
    <div class="scene-element-list">
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
        </div>
      </draggable>
    </div>
  </el-popover>
</template>

<script>
import draggable from 'vuedraggable'
import { getImageUrl } from '../mixins/imageUtils.js'
import toolbarPopMixin from './toolbarPopMixin'
import IconList from './res/list.svg'
export default {
  name: 'PopElementList',
  components: {
    IconList,
    draggable
  },
  mixins: [ toolbarPopMixin ],
  props: {
    checkedElements: {
      type: Array
    }
  },

  computed: {
    viewPort () {
      return {
        width: 24,
        height: 24
      }
    }
  },

  methods: {
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
.scene-element-list {
  max-height: calc(100% - 100px);
  overflow-y: scroll;
  .list-content {
    .element-item {
      padding: 5px;
      line-height: 24px;
      cursor: pointer;
      &:hover {
        background: #fefefe;
      }
      &.checked {
        background: #293039;
        color: #fff;
      }
      .element-icon {
        width: 24px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .shape {
          border: 1px solid #ccc;
          width: 24px;
          height: 14px;
        }
      }
      .element-name {
        margin: 0 5px;
      }
      display: flex;
    }
  }
}
</style>
