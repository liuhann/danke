<template>
  <div id="page-frames-list"
       class="site-page"
  >
    <nav-bar />
    <section class="first section list-section">
      <div class="body">
        <el-button type="success" @click="newObject">
          新建
        </el-button>
        <div class="category">
          <span v-for="t in types" :key="t.name" :class="type===t.value ? 'checked': ''" @click="typeChange(t.value)">{{ t.label }}</span>
        </div>
        <div class="type-groups">
          <div v-for="g in groups" :key="g" class="group" :class="g=== group? 'current': ''" @click="groupChange(g)">
            {{ g }}
          </div>
        </div>
        <div class="animations">
          <div v-for="a in animations" :key="a.name" class="animation" :class="a.name === animation.name? 'current': ''" @click="animationChange(a)">
            {{ a.direction }}
          </div>
        </div>
        <div class="animation-box" :style="boxStyle">
          <div class="animation-preview">
            <img :src="CLOUD_HILL" :style="chillStyle" :class="animation && animation.name">
          </div>
          <el-form size="mini" class="refresh" label-width="80px">
            <el-form-item label="名称">
              {{ animation.name }}
            </el-form-item>
            <el-form-item label="带遮罩">
              <el-checkbox v-model="hasMask" />
            </el-form-item>
            <el-form-item label="视角">
              <el-input-number v-model="perspective" size="mini" controls-position="right" />px
            </el-form-item>
            <el-form-item v-for="variable in animation.variables" :key="variable.name" :label="variable.name">
              <el-input v-model="variable.value" size="mini" />
            </el-form-item>
            <el-button type="text" icon="el-icon-refresh-right" @click="refreshCurrent" />
            <el-button type="text" icon="el-icon-edit" @click="edit(animation)" />
          </el-form>
          <!-- <div class="refresh">
            <div>{{ animation.name }}</div>
            <div>
              <el-checkbox v-model="hasMask">
                带遮罩
              </el-checkbox>
            </div>
            <div>
              perspect: <el-input-number v-model="perspective" size="mini" controls-position="right" />
            </div>
            <div v-for="variable in animation.variables" :key="variable.name">
              {{ variable.name }} 
            </div>
            <el-button type="text" icon="el-icon-refresh-right" @click="refreshCurrent" />
            <el-button type="text" icon="el-icon-edit" @click="edit(animation)" />
          </div> -->
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import NavBar from '../site/components/NavBar.vue'
import CLOUD_HILL from './cloud-hill.webp'
import { Pagination, Button, InputNumber, Checkbox, Form, FormItem, Input } from 'element-ui'
import types from './types'
import RestDAO from '../utils/restdao.js'
import StyleRegistry from '../xd-builder/utils/StyleRegistry'
import { assignVariables } from '../xd-builder/mixins/renderUtils'
export default {
  name: 'PageFrameList',
  components: {
    NavBar,
    [Pagination.name]: Pagination,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [InputNumber.name]: InputNumber,
    [Form.name]: Form,
    [Input.name]: Input,
    [FormItem.name]: FormItem
  },
  data () {
    return {
      hasMask: false,
      types,
      type: 'basic',
      perspective: 400,
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
    chillStyle () {
      if (this.hasMask) {
        return {
          maskImage: 'url(http://image.danke.fun/15011245191/images/mGuzU_K7ro_.svg)'
        }
      } else {
        return {}
      }
    },
    filter () {
      return {
        tags: this.type
      }
    },
    boxStyle () {
      const style = {
        perspective: this.perspective + 'px'
      }
      assignVariables(style, this.animation.variables)
      return style
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

    boxStyle (animation) {

      const style = {

      }
    },

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
    margin: 0 30px;
    width: 100%;
  }
  .list-section {
    background: #fff;
    padding: 3rem 0;
    .category {
      margin-top: 20px;
      text-align: left;
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
    height: 480px;
    display: flex;
    .animation-preview {
      overflow: hidden;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    img {
      width: 480px;
      height: 320px;
      mask-repeat: no-repeat;
    }
    .refresh {
      width: 480px;
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
