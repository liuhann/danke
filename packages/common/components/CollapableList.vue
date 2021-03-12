<template>
  <div class="collapse-list">
    <div v-for="(item, index) in items" :key="index" :style="style" class="item-wrapper" @click="itemClicked(item, index)" @dragstart="dragStart(item, $event)">
      <div class="item-content" :style="styleItemContent">
        <el-dropdown v-if="itemCommands && itemCommands.length" class="drop-down" @command="(cmd) => handleCommand(cmd, item)">
          <span class="el-dropdown-link">
            <el-button icon="el-icon-more-outline" size="mini" circle />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(command,index) in itemCommands" :key="index" :command="command.value">{{ command.label }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <div class="preview-content" :style="styleContent">
          <img v-if="item.url && !item.html" :style="imageStyle" :src="getImageUrl(item.url, 100, 80)">
          <div v-if="item.html" class="html-container" :style="getVariableStyle(item.variables)">
            <div class="styled-box" :style="{
            }" v-html="item.html"
            />
          </div>
        </div>
        <div v-if="showName" class="title" :style="textStyle">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dropdown, DropdownMenu, DropdownItem, Button } from 'element-ui'
import { getVariableStyle } from '../../xd-builder/mixins/renderUtils'
import { getImageUrl } from '../../utils/getImageUrl'

export default {
  name: "CollapableList",
  components: {
    [Button.name]: Button,
    [Dropdown.name]: Dropdown,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem
  },
  props: {
    width: {
      type: Number,
    },
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

    itemPadding: {
      type: Number,
      default: 5
    },

    styleItemContent: {
      type: Object
    },
    imageStyle: {
      type: Object
    },
    textStyle: {
      type: Object
    },
    showName: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      gridWidth: 100,
      style: {}
    }
  },

  computed : {
    styleContent () {
      return {
        width: this.gridWidth/2 + 'px',
        height: this.gridWidth/2 + 'px',
        margin: this.showName ? '10% auto' : '20%'
      }
    }
  },

  mounted () {
    const availWidth = this.width || this.$el.clientWidth
    if (this.column) {
      this.gridWidth = Math.floor( availWidth / this.column)
    }
    this.style.width = this.gridWidth + 'px'
    this.style.height = this.gridWidth + 'px'
    this.style.padding = this.itemPadding + 'px'
  },
  methods: {
    getImageUrl,
    getVariableStyle,
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
  display: flex;
  flex-wrap: wrap;
  .item-wrapper {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    .item-content {
      position: relative;
      height: 100%;
      width: 100%;

      .preview-content {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 100%;
          max-height: 100%;
        }
        .html-container {
          width: 100%;
          height: 100%;
          .styled-box {
            width: 100%;
            height: 100%;
          }
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
