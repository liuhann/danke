<template>
  <div id="page-frames-list"
    class="site-page">
    <nav-bar />
    <section class="section splash">
      <div class="container">
        <h1>可调整的动画</h1>
        <h2>css frame直出</h2>
      </div>
    </section>
    <section class="section list-section">
      <div class="container">
        <el-button size="mini" type="primary" @click="newObject">新建</el-button>
        <div class="category">
          <span :class="type==='' ? 'checked': ''" @click="setType({value: ''})">所有</span>
          <span v-for="t in types" :key="t.name" :class="type===t.value ? 'checked': ''" @click="setType(t)">{{t.label}}</span>
        </div>
        <div class="object-list">
          <div v-for="(object, index) in objects" :key="index" class="object-item" @mouseenter="animationMouseEnter(object)">
            <div class="animation-name" v-if="object.name !== 'none'">
              {{object.name}}
            </div>
            <div class="object-container">
              <span v-if="object.tags.join('').indexOf('text') > -1" :class="object.name">{{object.title}}</span>
              <img v-else :src="CLOUD_HILL" :class="object.name"/>
            </div>
            <div class="item-btns">
              <el-button circle icon="el-icon-delete" @click="remove(object)"/>
              <el-button circle icon="el-icon-edit" @click="edit(object)"/>
            </div>
          </div>
        </div>
        <el-pagination background :total="total" :page-size="pageSize" @current-change="loadObjects" :current-page.sync="page" layout="prev, pager, next" />
      </div>
    </section>
  </div>
</template>

<script>
import objectListMixin from '../common/components/objectListMixin'
import NavBar from '../site/components/NavBar.vue'
import CLOUD_HILL from './cloud-hill.webp'
import { Pagination, Button } from 'element-ui'
import StyleRegistry from '../xd-builder/utils/StyleRegistry'
import types from './types'
export default {
  name: 'PageFrameList',
  mixins: [ objectListMixin ],
  components: {
    NavBar,
    [Pagination.name]: Pagination,
    [Button.name]: Button
  },
  data () {
    return {
      types,
      type: 'enter',
      restPath: 'danke/animation',
      CLOUD_HILL
    }
  },
  computed: {
    filter () {
      return {
        tags: this.type
      }
    }
  },
  created () {
    this.styleRegistry = new StyleRegistry()
  },
  methods: {
    newObject () {
      window.open('/frame/edit')
    },
    objectUpdated () {
      for (let object of this.objects) {
        this.styleRegistry.addFrame(object)
      }
    },
    // 鼠标移动上面之后会进行frame演示
    animationMouseEnter (animation) {
      animation.dataName = animation.name
      animation.name = ''
      setTimeout(() => {
        animation.name = animation.dataName
      }, 300)
    },
    setType (type) {
      this.type = type.value
      this.loadObjects()
    },
    // 新窗口编辑
    edit (object) {
      window.open('/frame/edit?id=' + object._id)
    }
  }
}
</script>

<style lang="scss">
#page-frames-list {
  min-height: 100%;
  color: #fff;
  font-size: 16px;
  background: linear-gradient(180deg, #0C003C 0%, #BFFFAF 120%), linear-gradient(165deg, #480045 25%, #E9EAAF 120%), linear-gradient(145deg, #480045 25%, #E9EAAF 100%), linear-gradient(300deg, rgba(233, 223, 255, 0) 0%, #AF89FF 100%), linear-gradient(90deg, #45EBA5 0%, #45EBA5 30%, #21ABA5 30%, #21ABA5 60%, #1D566E 60%, #1D566E 70%, #163A5F 70%, #163A5F 10%);
  background-blend-mode: overlay, overlay, overlay, multiply, normal;

  .splash {
    h1 {
      font-size: 40px;
      text-align: center;
    }
    h2 {
      font-size: 22px;
      text-align: center;
    }
    height: 10rem;
    margin: 4rem 0;
  }
  .list-section {
    background: #fff;
    padding: 3rem 0;
    .category {
      text-align: center;
      color: #666;
      cursor: pointer;
      margin-bottom: 20px;
      >span {
        padding: 10px 0;
        margin: 0 20px;
        &:hover, &.checked {
          color: #00bf72;
          border-bottom: 2px solid #00bf72;
        }
      }
    }
  }
  .object-list {
    display: flex;
    flex-wrap: wrap;
    .object-item {
      position: relative;
      border: #e6e6e6 solid 1px;
      margin: 20px;
      justify-content: space-between;
      border-radius: 1rem;
      overflow: hidden;
      width: calc(25% - 60px);
      padding: 40px 10px;
      color: #666;
      perspective: 200px;
      display: flex;
      align-items: center;
      .animation-name {
        position: absolute;
        left: 0;
        top: 10px;
        width: 100%;
        text-align: center;
      }
      &:nth-of-type(4n) {
        margin-right: 0;
      }
      .item-btns {
        position: absolute;
        width: 100%;
        left: 20px;
        bottom: 20px;
        display: none;
      }
      &:hover {
        .item-btns {
          display: initial;
        }
      }
      .object-container {
        margin: 30px auto;
        height: 120px;
        width: 120px;
        text-align: center;
        line-height: 120px;
        font-size: 22px;
        img {
          width: 120px;
          height: 120px;
          object-fit: cover;
        }
        span {
          display: block;
          width: 200px;
          text-align: center;
          margin-left: -40px;
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
