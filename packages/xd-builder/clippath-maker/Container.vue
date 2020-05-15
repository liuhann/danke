<template>
  <div
    class="ad-Container"
    @mouseup="cancelDragging">
    <div class="ad-Container-main">
      <div class="ad-Container-svg">
        <svg-grid
          ref="svg"
          :path="generatePath"
          :w="w"
          :h="h"
          :grid="grid"
          :points="points"
          :active-point="activePoint"
          @addPoint="addPoint"
          @pointDblClick="togglePointType"
          @setDraggedPoint="setDraggedPoint"
          @setDraggedQuadratic='setDraggedQuadratic'
          @setDraggedCubic="setDraggedCubic"
          @handleMouseMove="handleMouseMove"/>
      </div>
    </div>
  </div>
</template>

<script>
import SvgGrid from './SvgGrid'
import './style.scss'
export default {
  name: 'Container',
  components: {
    SvgGrid
  },
  data () {
    return {
      w: 600,
      h: 600,
      grid: {
        show: true,
        snap: true,
        size: 25
      },
      ctrl: false,
      points: [
        { x: 100, y: 300 },
        { x: 200, y: 300, q: { x: 150, y: 50 } },
        { x: 300, y: 300, q: { x: 250, y: 550 } },
        { x: 400, y: 300, q: { x: 350, y: 50 } },
        // { x: 500, y: 300, c: [{ x: 450, y: 550 }, { x: 450, y: 50 }] },
        // { x: 600, y: 300, c: [{ x: 550, y: 50 }, { x: 550, y: 550 }] },
        // { x: 700, y: 300, a: { rx: 50, ry: 50, rot: 0, laf: 1, sf: 1 } }
      ],
      activePoint: 2,
      draggedPoint: false,
      draggedQuadratic: false,
      draggedCubic: false,
      closePath: false
    }
  },
  computed: {
    generatePath () {
      let d = ""

      this.points.forEach((p, i) => {
        if (i === 0) {
          // first point
          d += "M "
        } else if (p.q) {
          // quadratic
          d += `Q ${ p.q.x } ${ p.q.y } `
        } else if (p.c) {
          // cubic
          d += `C ${ p.c[0].x } ${ p.c[0].y } ${ p.c[1].x } ${ p.c[1].y } `
        } else if (p.a) {
          // arc
          d += `A ${ p.a.rx } ${ p.a.ry } ${ p.a.rot } ${ p.a.laf } ${ p.a.sf } `
        } else {
          d += "L "
        }

        d += `${ p.x } ${ p.y } `
      })

      if (this.closePath) d += "Z"

      return d
    }
  },

  mounted () {
    document.addEventListener("keydown", this.handleKeyDown, false)
    document.addEventListener("keyup", this.handleKeyUp, false)
  },
  destroyed () {
    document.removeEventListener("keydown", this.handleKeyDown)
    document.removeEventListener("keyup", this.handleKeyUp)
  },
  methods: {
    reset () {
      let w = this.w, h = this.h
      this.points = [{ x: w / 2, y: h / 2 }]
      this.activePoint = 0
    },
    handleKeyDown (e) {
      if (e.ctrlKey) {
        this.ctrl = true
      }
    },
    handleKeyUp (e) {
      if (!e.ctrlKey) {
        this.ctrl = false
      }
    },
    getMouseCoords (e) {
      const rect = this.$refs.svg.$el.getBoundingClientRect()
      let x = Math.round(e.pageX - rect.left)
      let y = Math.round(e.pageY - rect.top)

      // grid support
      // if (this.grid.snap) {
      //   x = this.grid.size * Math.round(x / this.grid.size)
      //   y = this.grid.size * Math.round(y / this.grid.size)
      // }
      return { x, y }
    },
    cancelDragging () {
      this.draggedPoint = false
      this.draggedQuadratic = false
      this.draggedCubic = false
    },
    addPoint (e) {
      if (e.ctrlKey) {
        let coords = this.getMouseCoords(e)
        this.points.push(coords)
        this.activePoint = this.points.length -1
      }
    },
    removePoint (index) {
      this.points.splice(index, 1)
      this.activePoint = 0
    },
    setDraggedPoint (index) {
      if (!this.ctrl) {
        this.activePoint = index
        this.draggedPoint = true
      }
    },

    setDraggedQuadratic (index) {
      if (!this.ctrl) {
        this.activePoint = index
        this.draggedQuadratic = true
      }
    },

    setDraggedCubic (index, anchor) {
      if (!this.ctrl) {
        this.activePoint = index
        this.draggedCubic = anchor
      }
    },

    setPointCoords (coords) {
      const active = this.activePoint
      this.points[active].x = coords.x
      this.points[active].y = coords.y
    },

    setQuadraticCoords (coords) {
      const active = this.activePoint

      this.points[active].q.x = coords.x
      this.points[active].q.y = coords.y
    },

    setCubicCoords (coords, anchor) {
      const active = this.activePoint

      this.points[active].c[anchor].x = coords.x
      this.points[active].c[anchor].y = coords.y
    },

    togglePointType ()  {
      const points = this.points
      const active = this.activePoint

      // not the first point
      if (active !== 0) {
        let v = 'l'
        if (points[active].q) {
          v = 'c'
        } else if (points[active].c) {
          v = 'a'
        } else if (points[active].a) {
          v = 'l'
        } else {
          v = 'q'
        }

        switch (v) {
          case "l":
            this.$set(points, active, {
              x: points[active].x,
              y: points[active].y
            })
            break
          case "q":
            this.$set(points, active, {
              x: points[active].x,
              y: points[active].y,
              q: {
                x: (points[active].x + points[active - 1].x) / 2,
                y: (points[active].y + points[active - 1].y) / 2
              }
            })
            break
          case "c":
            this.$set(points, active, {
              x: points[active].x,
              y: points[active].y,
              c: [
                {
                  x: (points[active].x + points[active - 1].x - 50) / 2,
                  y: (points[active].y + points[active - 1].y) / 2
                },
                {
                  x: (points[active].x + points[active - 1].x + 50) / 2,
                  y: (points[active].y + points[active - 1].y) / 2
                }
              ]
            })
            break
          case "a":
            this.$set(points, active, {
              x: points[active].x,
              y: points[active].y,
              a: {
                rx: 50,
                ry: 50,
                rot: 0,
                laf: 1,
                sf: 1
              }
            })
            break
        }
      } else {
        this.closePath = !this.closePath
      }
    },

    handleMouseMove (e) {
      if ( !this.ctrl) {
        if (this.draggedPoint) {
          this.setPointCoords(this.getMouseCoords(e))
        } else if (this.draggedQuadratic) {
          this.setQuadraticCoords(this.getMouseCoords(e))
        } else if (this.draggedCubic !== false) {
          this.setCubicCoords(this.getMouseCoords(e), this.draggedCubic)
        }
      }
    }
  }
}
</script>

