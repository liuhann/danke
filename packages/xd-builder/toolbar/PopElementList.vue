<template>
<el-popover
  placement="bottom-start"
  popper-class="toolbar-pop"
  width="240"
  title="元素列表"
  trigger="click">
  <el-tooltip class="item" effect="dark" content="元素列表" placement="bottom" slot="reference">
    <a class="action"><icon-list /></a>
  </el-tooltip>
  <div class="scene-element-list">
    <div class="element-action">
      <el-button size="mini"></el-button>
    </div>
    <div class="list-content">
      <div class="element-item" :class="element.selected? 'checked': ''" v-for="element of scene.elements" :key="element.id" @click="checkElement(element, $event)">
        <div class="element-icon">
          <render-element :element="element" :view-port="viewPort" :view-box="element" />
        </div>
        <div class="element-name">{{element.name}}</div>
      </div>
    </div>
  </div>
</el-popover>
</template>

<script>
import toolbarPopMixin from './toolbarPopMixin'
import IconList from './res/list.svg'
import RenderElement from '../render/RenderElement'
export default {
  name: 'PopElementList',
  mixins: [ toolbarPopMixin ],
  props: {
    checkedElements: {
      type: Array
    }
  },
  components: {
    RenderElement,
    IconList
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
        background: #f1f1f1;
      }
      &.checked {
        background: #293039;
        color: #fff;
      }
      .element-icon {
        width: 24px;
        height: 24px;
      }
      .element-name {
        margin: 0 5px;
      }
      display: flex;
    }
  }
}
</style>
