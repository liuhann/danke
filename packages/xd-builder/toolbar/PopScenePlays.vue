<template>
<el-popover
  placement="bottom-start"
  popper-class="toolbar-pop"
  width="240"
  title="播放设置"
  @show="show"
  trigger="click">
  <a class="action" slot="reference"><i class="el-icon-timer" /></a>
  <div class="scene-plays-list">
    <div class="tick-list">
      <div class="tick" v-for="(tick, index) of work.play.ticks" :key="index">
        <div class="index">{{index + 1}}</div>
        <div><el-input-number v-model="tick.time" size="mini" step=".1" controls-position="right" /></div>
      </div>
    </div>
  </div>
</el-popover>
</template>

<script>
import toolbarPopMixin from './toolbarPopMixin'
export default {
  name: 'PopScenePlays',
  mixins: [ toolbarPopMixin ],
  props: {
    checkedElements: {
      type: Array
    }
  },
  components: {

  },

  computed: {

  },

  methods: {
    show () {
      while (this.work.play.ticks.length < this.work.scenes.length) {
        this.work.play.ticks.push({
          time: 3,
          cover: true
        })
      }
      this.work.play.ticks.length = this.work.scenes.length - 1

    },
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
.scene-plays-list {
  max-height: calc(100% - 100px);
  overflow-y: scroll;
  .tick-list {
    .index {
      width: 16px;
      text-align: right;
      margin-right: 10px;
    }
    .tick {
      line-height: 30px;
      padding: 5px 0;
      display: flex;
    }
  }
}
</style>
