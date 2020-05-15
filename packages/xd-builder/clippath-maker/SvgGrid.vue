<template>
<svg
  class="ad-SVG"
  :width="w"
  :height="h"
  @click="addPoint($event)"
  @mousemove="$emit('handleMouseMove', $event)">
  <path
    class="ad-Path"
    :d="path" />
  <g className="ad-Points">
    <g class="ad-PointGroup" v-for="(p, i) in points" :key="i"
       :class="[i === 0? 'ad-PointGroup--first': '', activePoint === i ? 'is-active' : '']">
      <circle
        class="ad-Point"
        @mousedown="$emit('setDraggedPoint', i)"
        @dblclick="$emit('pointDblClick', i)"
        :cx='p.x'
        :cy='p.y'
        :r='8' />
      <Quadratic v-if="p.q" :index="i" :p1x="points[i - 1].x" :p1y="points[i-1].y"
                 :p2x="p.x" :p2y="p.y" :x="p.q.x" :y="p.q.y" @setDraggedQuadratic="$emit('setDraggedQuadratic', i)"/>
      <Cubic v-if="p.c" :index="i" :p1x="points[i - 1].x" :p1y="points[i - 1].y"
        :p2x="p.x" :p2y="p.y" :x1="p.c[0].x" :y1="p.c[0].y" :x2="p.c[1].x" :y2="p.c[1].y"
        @setDraggedCubic="setDraggedCubic(i, $event)"/>
    </g>
  </g>
</svg>
</template>

<script>

import Quadratic from './Quadratic'
import Cubic from './Cubic'
export default {
  name: 'SvgGrid',
  components: { Cubic, Quadratic },
  props: ['w', 'h', 'path', 'grid', 'points', 'activePoint'],
  methods: {
    addPoint (e) {
      this.$emit('addPoint', e)
    },
    setDraggedCubic (index, anchor) {
      this.$emit('setDraggedCubic', index, anchor)
    }
  }
}
</script>
