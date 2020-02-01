<template>
<section id="scene-container">
  <div class="screen" :style="styleScreen">
    <div class="scene" @dragover="sceneDragOver" v-if="scene">
      <render-element
          v-for="(element, index) of scene.elements"
          stage="in"
          :element="element"
          :key="element.id"
          :index="index"
          :ref="element.id"/>
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
      // 屏幕区的位置
      screenRect: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      },
      // 拖拽区域信息
      dragRect: {
        // 坐标 x, y
        left: 0,
        top: 0,
        // 宽度高度
        width: 0,
        height: 0,
        visible: false
      }
    }
  },

  computed: {
    styleScreen () {
      return {
        left: this.screenRect.x + 'px',
        top: this.screenRect.y + 'px',
        width: this.screenRect.width + 'px',
        height: this.screenRect.height + 'px'
      }
    },
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
        },
        onmove: event => {
          this.dragRect.width = event.page.x - event.x0
          this.dragRect.height = event.page.y - event.y0
          if (this.dragRect.width < 0) {
            this.dragRect.left = (event.x0 - event.rect.left) + this.dragRect.width
            this.dragRect.width = -this.dragRect.width
          }
          if (this.dragRect.height < 0) {
            this.dragRect.top = (event.y0 - event.rect.top) + this.dragRect.height
            this.dragRect.height = -this.dragRect.height
          }
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
      this.screenRect.width = this.screen.width
      this.screenRect.height = this.screen.height
      this.screenRect.x = (this.$el.clientWidth - this.screen.width) / 2
      this.screenRect.y = 20
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
  .screen {
    position: absolute;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==");
    box-shadow: 0 0 6px #ddd;
  }
  .mask {
    .dragging-rect {
      position: absolute;
      border: 1px solid #42A5F5;
      background: #3366665e;
    }
  }
}
</style>
