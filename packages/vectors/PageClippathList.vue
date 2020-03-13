<template>
<div id="page-clippath-list" class="site-page">
  <nav-bar />
  <section class="section splash">
    <div class="container">
      <h1>让你的图片自由裁切与变换</h1>
      <h2>基于SVG文件格式，可任意配置、下载</h2>
    </div>
  </section>
  <section class="section list-section">
    <div class="container">
      <el-button size="mini" type="primary" @click="newClipPath">新建</el-button>
      <div class="object-list">
        <div v-for="(object, index) in objects" :key="index" class="object-item">
          <div class="object-container" :style="{
            '--scaleX': 280 / object.width,
            '--scaleY': 240 / object.height
          }">
            <img :src="CLOUD_HILL" :style="{
              'clip-path': `url('#${object.name}')`
            }"/>
            <div class="svg" v-html="object.content" />
          </div>
          <div class="item-btns">
            <el-button circle size="mini" icon="el-icon-delete" @click="remove(object)"/>
            <el-button circle size="mini" icon="el-icon-edit" @click="edit(object)"/>
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
export default {
  name: 'PageStyleList',
  mixins: [ objectListMixin ],
  components: {
    NavBar,
    [Pagination.name]: Pagination,
    [Button.name]: Button
  },
  data () {
    return {
      restPath: 'danke/clippath',
      CLOUD_HILL,
    }
  },
  created () {
  },
  methods: {
    newClipPath () {
      window.open('/clippath/edit')
    },
    // 新窗口编辑
    edit (object) {
      window.open('/clippath/edit?id=' + object._id)
    }
  }
}
</script>

<style lang="scss">
#page-clippath-list {
  height: 100%;
  color: #fff;
  font-size: 16px;
  background: linear-gradient(180deg, #0C003C 0%, #BFFFAF 120%), linear-gradient(165deg, #480045 25%, #E9EAAF 120%), linear-gradient(145deg, #480045 25%, #E9EAAF 100%), linear-gradient(300deg, rgba(233, 223, 255, 0) 0%, #AF89FF 100%), linear-gradient(90deg, #45EBA5 0%, #45EBA5 30%, #21ABA5 30%, #21ABA5 60%, #1D566E 60%, #1D566E 70%, #163A5F 70%, #163A5F 10%);
  background-blend-mode: overlay, overlay, overlay, multiply, normal;
}
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
}
.object-list {
  display: flex;
  flex-wrap: wrap;
  .object-item {
    position: relative;
    border: #e6e6e6 solid 1px;
    margin: 0 32px 50px 0;
    border-radius: 1rem;
    overflow: hidden;
    width: calc(25% - 52px);
    padding: 40px 10px;

    &:nth-of-type(4n) {
      margin-right: 0;
    }
    .item-btns {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
      background: rgba(0,0,0, .4);
      display: none;
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

</style>
