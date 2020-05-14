<template>
  <div id="page-frames-list"
    class="site-page">
    <nav-bar />
    <section class="first section list-section">
      <div class="body">
        <el-button size="mini" type="primary" @click="newObject">新建</el-button>
        <div class="category">
          <span v-for="t in types" :key="t.name" :class="type===t.value ? 'checked': ''" @click="typeChange(t.value)">{{t.label}}</span>
        </div>
        <div class="type-groups">
          <div v-for="g in groups" :key="g" class="group" :class="g=== group? 'current': ''" @click="groupChange(g)">{{g}}</div>
        </div>
        <div class="animations">
          <div v-for="a in animations" :key="a.name" class="animation" :class="a.name === animation.name? 'current': ''" @click="animationChange(a)">{{a.direction}}</div>
        </div>
        <div class="animation-box">
          <img :src="CLOUD_HILL" :class="animation && animation.name"/>
          <div class="refresh">{{animation.name}}<i @click="refreshCurrent" class="el-icon-refresh-right" /> <i @click="edit(animation)" class="el-icon-edit" /></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import NavBar from '../site/components/NavBar.vue'
import CLOUD_HILL from './cloud-hill.webp'
import { Pagination, Button } from 'element-ui'
import types from './types'
import RestDAO from '../common/dao/restdao'
import StyleRegistry from '../xd-builder/utils/StyleRegistry'
export default {
  name: 'PageFrameList',
  components: {
    NavBar,
    [Pagination.name]: Pagination,
    [Button.name]: Button
  },
  data () {
    return {
      types,
      type: 'basic',
      showAnimationChoose: false,
      group: '',
      groups: [],
      animation: {},
      animations: [],
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
    this.framedao = new RestDAO(this.ctx, 'danke/animation')
  },

  mounted () {
    this.typeChange()
  },
  methods: {
    async typeChange (type) {
      if (type) {
        this.type = type
      }
      await this.loadTypeGroup()
      this.groupChange(this.groups[0])
    },
    async loadTypeGroup () {
      const result = await this.framedao.distinct('group', {
        type: this.type
      })
      this.groups = result
    },

    async groupChange(group) {
      this.group = group
      await this.loadGroupAnimations()
      if (this.animations.length) {
        this.animation = this.animations[0]
        this.styleRegistry.addFrame(this.animation)
      }
    },

    async loadGroupAnimations () {
      const result = await this.framedao.list({
        type: this.type,
        group: this.group
      })
      this.animations = result.list
    },

    refreshCurrent () {
      const replayStore = this.animation.name
      this.animation.name = ''
      setTimeout(() => {
        this.animation.name = replayStore
      }, 200)
    },

    animationChange (animation) {
      this.animation = animation
      this.animation.delay = 0
      this.styleRegistry.addFrame(this.animation)
    },

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
    async setType (type) {
      this.type = type.value
      await this.loadTypeGroup()
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
  color: #0a0a0a;
  font-size: 16px;

  .body {
    margin: 30px;
    width: 100%;
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

  .animations {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    .animation {
      width: 20%;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
      &.current {
        background: #00c4cc;
        color: #fff;
      }
    }
  }

  .animation-box {
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fafafa;
    position: relative;
    overflow: hidden;
    perspective: 160px;
    img {
      width: 240px;
      height: 160px;
    }
    .refresh {
      position: absolute;
      right: 10px;
      top: 10px;
      i {
        font-size: 22px;
      }
    }
  }

  .type-groups {
    display: flex;
    flex-wrap: wrap;
    .group {
      width: 100px;
      height: 100px;
      cursor: pointer;
      border-radius: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 10px;
      background-color: #efefef;
      &.current {
        background: #00c4cc;
        color: #fff;
      }
    }
    margin-bottom: 10px;
  }
}

</style>
