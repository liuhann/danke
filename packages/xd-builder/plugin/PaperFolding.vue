<template>
<div class="paper-folder">
  <div v-for="i in split[0]" :key="i">
    <img v-for="j in split[1]" :key="j" :src="url" :style="getRectStyle(i, j)"/>
  </div>
</div>
</template>

<script>
export default {
  name: 'PaperFolding.vue',
  props: {
    // 图片地址
    url: {
      type: String
    },
    // 图片拆分块数, [1, 3] 表示横向拆分一块（不拆分） ，纵向拆分3块
    split: {
      type: Array
    },
    // 使用的keyframe效果名称
    keyframe: {
      type: String
    },
    // 播放动画的持续时间
    duration: {
      type: Number
    },
    // 动画的时间函数
    timing: {
      type: String
    },
    // 延迟时间
    delay: {
      type: Number
    },
    // 动画发起位置， [1, 1]表示第一个节点  如果为-1表示整行或者整列
    from: {
      type: Array
    }
  },
  methods: {
    getRectStyle (i, j) {
      const clipPath = `polygon(
      ${(i - 1) / this.split[0] * 100 - 1}% ${(j - 1) / this.split[1] * 100}%,
      ${i / this.split[0] * 100}% ${(j - 1) / this.split[1] * 100}%,
      ${i / this.split[0] * 100}% ${j / this.split[1] * 100}%,
      ${(i - 1) / this.split[0] * 100 - 1}% ${j / this.split[1] * 100}%)`
      return {
        clipPath: clipPath
      }
    }
  }
}
</script>

<style lang="scss">
.paper-folder {
  width: 100%;
  height: 100%;
  position: relative;
  img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%
  }
}
</style>
