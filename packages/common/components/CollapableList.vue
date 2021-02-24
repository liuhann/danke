<template>
  <div class="collapse-list">
    <div v-for="(item, index) in items" :key="index" :style="style" class="item-wrapper" @click="itemClicked(item, index)" @dragstart="dragStart(item, $event)">
      <div class="item-content" :style="styleItemContent">
        <el-dropdown v-if="itemCommands && itemCommands.length" class="drop-down" @command="(cmd) => handleCommand(cmd, item)">
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(command,index) in itemCommands" :key="index" :command="command.value">{{ command.label }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <div class="preview-content" :style="{width: gridWidth/2 + 'px', height: gridWidth/2 + 'px'}">
          <img v-if="item.url" :style="imageStyle" :src="getImageUrl(item.url, 100, 80)">
          <div v-if="item.html" class="html-container" :style="variableValues(vector)">
            <div class="styled-box" :style="{
            }" v-html="item.html"
            />
          </div>
        </div>
        <div class="title" :style="textStyle">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dropdown, DropdownMenu, DropdownItem } from 'element-ui'
import { getImageUrl } from '../../utils/getImageUrl'

export default {
  name: "CollapableList",
  components: {
    [Dropdown.name]: Dropdown,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem
  },
  props: {
    items: {
      type: Array
    },
    column: {
      type: Number,
      default: 4
    },
    itemCommands: {
      type: Array
    },
    row: {
      type: Number,
      default: 2
    },
    itemStyle: {
      type: Object
    },
    styleItemContent: {
      type: Object
    },
    imageStyle: {
      type: Object
    },
    textStyle: {
      type: Object
    }
  },

  data () {
    return {
      gridWidth: 100,
      style: {}
    }
  },

  mounted () {
    const availWidth = this.width || this.$el.clientWidth
    if (this.column) {
      this.gridWidth = parseInt( availWidth / this.column)
    }
    this.style.width = this.gridWidth + 'px'
    this.style.height = this.gridWidth + 'px'
  },
  methods: {
    getImageUrl,
    itemClicked (item, index) {
      this.$emit('item-clicked', item, index)
    },
    dragStart (image, ev) {
      // stringify image info as text
      ev.dataTransfer.setData('Text', JSON.stringify(image))
    },
    handleCommand(command, item) {
      this.$emit('command', {
        cmd: command,
        item
      });
    }
  }
}
</script>

<style lang="scss">
.collapse-list {
  .item-wrapper {
    box-sizing: border-box;
    display: inline-block;
    position: relative;
    padding: 5px;
    .item-content {
      border: 1px solid #ccc;
      border-radius: 10px;
      height: 100%;
      .preview-content {
        margin: 10% auto;
        height: 70%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 100%;
          max-height: 100%;
        }
      }
      .title {
        font-size: 12px;
        height: 30%;
        line-height: 18px;
        overflow: hidden;
        text-align: center;
        padding: 0 10px;
      }
    }
    .drop-down {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
}
</style>
