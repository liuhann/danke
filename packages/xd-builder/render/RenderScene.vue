<template>
<div class="scene">
</div>
</template>

<script>
/**
 * 渲染场景
 */
export default {
  name: 'RenderScene',
  props: {
    // 渲染阶段 可以为进入、离开2个
    stage: {
      type: String
    },
    // 场景内容
    scene: {
      type: Object
    },
    // 场景渲染的区域，一般关注 width, height
    rect: {
      type: Object
    },
    // 是否进行自适应处理，默认为是， 就是将所有元素的x\y\width\height进行比例转换
    responsive: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style>

</style>
