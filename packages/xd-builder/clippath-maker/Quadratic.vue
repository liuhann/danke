<template>
  <g class="ad-Anchor">
    <line
      class="ad-Anchor-line"
      :x1="p1x"
      :y1="p1y"
      :x2="x"
      :y2="y"
    />
    <line
      class="ad-Anchor-line"
      :x1="x"
      :y1="y"
      :x2="p2x"
      :y2="p2y"
    />
    <circle
      class="ad-Anchor-point"
      :cx="x"
      :cy="y"
      :r="6"
      @mousedown="setDraggedQuadratic"
    />
  </g>
</template>

<script>
export default {
  name: 'Quadratic',
  props: ['p1x', 'p1y', 'x', 'y', 'p2x', 'p2y', 'index'],
  methods: {
    setDraggedQuadratic () {
      this.$emit('setDraggedQuadratic', this.index)
    }
  }
}
</script>
