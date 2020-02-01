<template>
<section id="scene-container">
  <div class="screen">
    <div class="scene" @dragover="sceneDragOver" v-if="scene" :style="scene.style" @click.self="sceneClick">
      <render-element
          v-for="(element, index) of scene.elements"
          stage="in"
          :element="element"
          :key="element.id"
          :index="index"
          :ref="element.id"
          :selected="currentElement === element"
          @click="chooseElement(element, $event)"/>
    </div>
  </div>
  <div class="mask">
    <div class="dragging-rect" :style="styleDragingRect">
    </div>
  </div>
</section>
</template>

<script>
import interact from 'interactjs'
export default {
  props: {
    scene: {
      type: Object
    },
    screen: {
      type: Object
    }
  },

  data () {
    return {
      screenPosition: {
        x: 0,
        y: 0
      },
      // 拖拽区域信息
      dragRect: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        visible: false
      }
    }
  },

  computed: {
    // 拖拽中的矩形样式
    styleDragingRect () {
      return {
        display: this.dragRect.visible ? 'inherit' : 'none',
        left: this.dragRect.left + 'px',
        top: this.dragRect.top + 'px',
        width: this.dragRect.width + 'px',
        height: this.dragRect.height + 'px'
      }
    }
  },

  mounted () {
    this.fitToCenter()
    this.initGlobalInteract()
  },
  methods: {
    initGlobalInteract () {
      interact(this.$el).draggable({
        onstart: event => {
          this.dragRect.left = event.x0 - event.rect.left
          this.dragRect.top = event.y0 - event.rect.top
          this.dragRect.visible = true
          console.log('drag start', event)
        },
        onmove: event => {
          this.dragRect.width = event.page.x - event.rect.left
          this.dragRect.height = event.page.y - event.rect.top
          console.log('drag move', event)
        },
        onend: event => {
          this.dragRect.visible = false
          console.log('drag end', event)
        }
      }).styleCursor(false)
    },
    sceneDragOver (ev) {
      ev.preventDefault()
    },

    sceneClick () {

    },

    fitToCenter () {
      console.log(this.$el.clientWidth, this.$el.clientHeight)
    }
  }
}
</script>

<style lang="scss">
#scene-container {
  position: relative;
  touch-action: none;
  user-select: none;
  flex: 1;
  .mask {
    .dragging-rect {
      position: absolute;
      border: 1px solid #42A5F5;
      background: #3366665e;
    }
  }
}
</style>
