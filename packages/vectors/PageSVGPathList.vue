<template>
  <div id="page-svgpath-list">
    <el-button size="mini" type="primary" @click="newPath">新建</el-button>
    <div class="object-list">
      <div v-for="(object, index) in objects" :key="index" class="object-item">
        <div class="object-container" :style="{
          ['--fill']: object.color,
          ['--stokeWidth']: object.strokeWidth,
          ['--stroke']: object.strokeColor
        }">
          <svg :viewBox="'0 0 ' + object.width + ' ' + object.height ">
            <path :d="generatePath(object)" fill="var(--fill)" stroke-width="var(--stokeWidth)" stroke="var(--stroke)" />
          </svg>
        </div>
        <div class="item-btns">
          <el-button circle icon="el-icon-delete" @click="remove(object)" />
          <el-button circle icon="el-icon-edit" @click="edit(object)" />
        </div>
      </div>
    </div>
    <el-pagination background :total="total" :page-size="pageSize" :current-page.sync="page" layout="prev, pager, next" @current-change="loadObjects" />
  </div>
</template>

<script>
import objectListMixin from '../common/components/objectListMixin'
import { Pagination, Button } from 'element-ui'
export default {
  name: 'PageSVGPathList',
  components: {
    [Pagination.name]: Pagination,
    [Button.name]: Button
  },
  mixins: [ objectListMixin ],
  data () {
    return {
      restPath: 'danke/path'
    }
  },
  created () {
  },
  methods: {
    newPath () {
      window.open('/path/edit')
    },
    generatePath (path) {
      let d = ""
      path.points.forEach((p, i) => {
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
      if (path.closePath) d += "Z"
      return d
    },

    // 新窗口编辑
    edit (object) {
      window.open('/path/edit?id=' + object._id)
    }
  }
}
</script>

<style lang="scss">
#page-svgpath-list {
  padding: 20px;
  height: 100%;
  color: #fff;
  font-size: 16px;

  .object-list {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 0;
  .object-item {
    position: relative;
    border: #e6e6e6 solid 1px;
    margin: 0 32px 50px 0;
    border-radius: 1rem;
    overflow: hidden;
    width: 240px;
    height: 240px;
    svg {
      width: 50%;
    }
    &:nth-of-type(4n) {
      margin-right: 0;
    }
    .item-btns {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
      display: none;
      padding: 10px;
    }
    &:hover {
      .item-btns {
        display: initial;
      }
    }
    .object-container {
      height: 240px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    div.svg {
      position: absolute;
      width: 100%;
      height: 100%;
      svg {
        width: 100%;
        height: 100%;
      }
    }
  }
}

}
</style>
