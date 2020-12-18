<!--元素排序弹出层-->
<template>
  <van-popup v-model="show" position="bottom" :style="{ height: '100%'}">
    <van-nav-bar>
      <template #right>
        <van-icon name="close" size="20" @click="show = false" />
      </template>
      <template #left>
        拖拽调整元素位置
      </template>
    </van-nav-bar>

    <draggable v-model="scene.elements" handle=".handle" ghost-class="ghost" :animation="200" @start="drag = true" @end="drag = false">
      <div v-for="element of scene.elements" :key="element.id" class="element-item" :class="element.selected? 'checked': ''">
        <div class="handle">
          <van-icon name="wap-nav" size="20" color="#666" />
        </div>
        <div class="element-icon" :style="elementVariables(element)">
          <img v-if="element.url" :src="getImageUrl(element.url)">
          <span v-else-if="element.text"><van-icon name="records" size="24" color="#666" /></span>
          <div v-else-if="element.html" v-html="element.html" />
          <div v-else class="shape" :style="element.style" />
        </div>
        <div class="element-name">
          {{ element.text || element.name }}
        </div>
        <div class="actions">
          <van-icon name="cross" size="20" color="#666" @click="deleteElement(element, scene)" />
        </div>
      </div>
    </draggable>
  </van-popup>
</template>

<script>
import draggable from 'vuedraggable'
import { getImageUrl } from '../../xd-builder/mixins/imageUtils'
import { assignVariables } from '../../xd-builder/mixins/renderUtils'
import { deleteElement } from '../../xd-builder/utils/sceneActions'

export default {
  name: "PopElementOrdering",
  components: { draggable },
  props: {
    scene: {
      type: Object
    },
    viewBox: {
      type: Object
    }
  },
  data () {
    return {
      show: false,
      viewPort: {
        width: 48,
        height: 48
      },
      drag: false
    }
  },
  methods: {
    deleteElement,
    getImageUrl,
    open () {
      this.show = true
    },

    elementVariables(element) {
      const style = {}
      assignVariables(style, element.variables)
      return style
    },

    opened () {

    }
  }
}
</script>

<style lang="scss">
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.flip-list-move {
  transition: transform 0.4s;
}

.element-item {
  padding: .5rem 0;
  line-height: 2rem;
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
  .handle, .actions {
    width: 3.5rem;
    height: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .element-icon {
    width: 2rem;
    height: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    div, svg {
      width: 2rem;
      height: 2rem;
    }
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
    line-height: 2.5rem;
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

</style>
