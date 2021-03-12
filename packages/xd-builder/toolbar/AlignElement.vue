<template>
  <span>
    <!-- 多选的对齐、平均分布功能-->
    <el-tooltip content="靠左对齐">
      <a class="action" @click="alignLeft"><icon-align-left /></a>
    </el-tooltip>
    <el-tooltip content="靠右对齐">
      <a class="action" @click="alignRight"><icon-align-right /></a>
    </el-tooltip>
    <el-tooltip content="顶部对齐">
      <a class="action" @click="alignTop"><icon-align-top /></a>
    </el-tooltip>
    <el-tooltip content="底部对齐">
      <a v-if="elements.length > 1" class="action" @click="alignBottom"><icon-align-bottom /></a>
    </el-tooltip>
    <el-tooltip content="横向居中对齐">
      <a v-if="elements.length > 1" class="action" @click="alignVerCenter"><icon-align-vertical /></a>
    </el-tooltip>
    <el-tooltip content="竖向居中对齐">
      <a v-if="elements.length > 1" class="action" @click="alignHorCenter"><icon-align-horizontal /></a>
    </el-tooltip>
    <el-tooltip content="竖向等距排列">
      <a v-if="elements.length > 2" class="action" @click="alignAverVer"><icon-aver-ver /></a>
    </el-tooltip>
    <el-tooltip content="横向等距排列">
      <a v-if="elements.length > 2" class="action" @click="alignAverHor"><icon-aver-hor /></a>
    </el-tooltip>
  </span>
</template>

<script>
import IconAlignLeft from './res/align-left.svg'
import IconAlignRight from './res/align-right.svg'
import IconAlignTop from './res/align_top.svg'
import IconAlignBottom from './res/align-bottom.svg'
import IconAlignVertical from './res/align-vertical.svg'
import IconAlignHorizontal from './res/align-horizontal.svg'
import IconAverHor from './res/align-aver-h.svg'
import IconAverVer from './res/align-aver-v.svg'
import { Tooltip } from 'element-ui'
export default {
  name: 'AlignElementVue',
  components: {
    [Tooltip.name]: Tooltip,
    IconAlignLeft,
    IconAlignRight,
    IconAlignTop,
    IconAlignBottom,
    IconAlignVertical,
    IconAlignHorizontal,
    IconAverHor,
    IconAverVer,
  },
  props: {
    elements: {
      type: Array
    }
  },
  methods: {
    alignLeft () {
      let leftPos = null
      for (let element of this.elements) {
        if (leftPos === null) {
          leftPos = element.x
        } else {
          element.x = leftPos
        }
      }
    },
    alignRight () {
      let rightPos = null
      for (let element of this.elements) {
        if (rightPos === null) {
          rightPos = element.x + element.width
        } else {
          element.x = rightPos - element.width
        }
      }
    },
    alignTop () {
      let topPos = null
      for (let element of this.elements) {
        if (topPos === null) {
          topPos = element.y
        } else {
          element.y = topPos
        }
      }
    },

    alignHorCenter () {
      let center = null
      for (let element of this.elements) {
        if (center === null) {
          center = element.x + element.width / 2
        } else {
          element.x = center - element.width / 2
        }
      }
    },

    // 横向等距排列
    alignAverHor () {
      const dup = []
      let totalWidth = 0
      for (let element of this.elements) {
        dup.push(element)
        totalWidth += element.width
      }

      dup.sort((a, b) => a.x - b.x)
      const min = dup[0].x
      const max = dup[dup.length -1].x + dup[dup.length -1].width
      // 间距 可能是负数
      const distance = (( max - min ) - totalWidth) / (dup.length - 1)

      for (let i = 1; i < dup.length; i++) {
        dup[i].x = dup[i-1].x + dup[i-1].width + distance
      }
    },

    // 竖向等距排列
    alignAverVer () {
      const dup = []
      let totalHeight = 0
      for (let element of this.elements) {
        dup.push(element)
        totalHeight += element.height
      }

      dup.sort((a, b) => a.y - b.y)
      const min = dup[0].y
      const max = dup[dup.length -1].y + dup[dup.length -1].height
      // 间距 可能是负数
      const distance = (( max - min ) - totalHeight) / (dup.length - 1)

      for (let i = 1; i < dup.length; i++) {
        dup[i].y = dup[i-1].y + dup[i-1].height + distance
      }
    },

    // 橫向居中
    alignVerCenter () {
      let center = null
      for (let element of this.elements) {
        if (center === null) {
          center = element.y + element.height / 2
        } else {
          element.y = center - element.height / 2
        }
      }
    },

    alignBottom () {
      let bottomPos = null
      for (let element of this.elements) {
        if (bottomPos === null) {
          bottomPos = element.y + element.height
        } else {
          element.y = bottomPos - element.height
        }
      }
    },
  }
}
</script>

<style scoped>

</style>