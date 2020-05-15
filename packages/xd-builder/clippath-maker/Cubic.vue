<template>
<g class="ad-Anchor">
  <line
    class="ad-Anchor-line"
    :x1='p1x'
    :y1='p1y'
    :x2='x1'
    :y2='y1' />
  <line
    class="ad-Anchor-line"
    :x1='p2x'
    :y1='p2y'
    :x2='x2'
    :y2='y2' />
  <circle
    class="ad-Anchor-point"
    @mousedown="$emit('setDraggedCubic',  0)"
    :cx='x1'
    :cy='y1'
    :r='6' />
  <circle
    class="ad-Anchor-point"
    @mousedown="$emit('setDraggedCubic', 1)"
    :cx='x2'
    :cy='y2'
    :r='6' />
</g>
</template>

<script>
export default {
  name: 'Cubic',
  props: ['p1x', 'p1y', 'x1', 'y1', 'x2', 'y2', 'p2x', 'p2y', 'index'],
}
</script>
