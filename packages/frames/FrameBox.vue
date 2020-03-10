<template>
<div class="frame-box">
  <el-row :gutter="20">
    <el-col :span="9">
      <div class="top-gu" style="line-height: 32px; padding: 3px 0;">
        <el-button @click="createFrame" size="mini" type="primary">创建</el-button>
        <el-select style="width: 96px;float: right;" v-model="currentTag" filterable @change="loadAnimation" placeholder="分类" size="mini">
          <el-option
            v-for="tag in tags"
            :key="tag"
            :label="tag"
            :value="tag">
          </el-option>
        </el-select>
      </div>
      <div class="animations">
        <div v-for="animation in animations" :key="animation.name" class="animation-item"
             :class="currentAnimation.name === animation.name? 'is-active': ''"
             @click="setAnimation(animation)">
          <div class="en-name">{{animation.name}}({{animation.title}})</div>
          <div class="type">{{animation.tags.join (' ')}}</div>
        </div>
      </div>
    </el-col>
    <el-col :span="15">
      <div style="margin: 0 auto;text-align: center;">
        <el-radio-group v-model="previewType" size="mini">
          <el-radio-button label="文字"></el-radio-button>
          <el-radio-button label="方块"></el-radio-button>
        </el-radio-group>
        <el-button class="op" type="text" v-if="isEdit" size="mini" icon="el-icon-edit" @click="editAnimation(currentAnimation)" />
      </div>
      <div class="frame-preview" :class="[previewType!=='文字'?'shadow': '']">
        <div v-if="previewType==='方块'" class="preview-box" :class="currentAnimation.name">
          <img :src="PREVIEW_IMG" width="160" height="160">
        </div>
        <div v-if="previewType==='文字'" class="preview-text" :class="currentAnimation.name">
          frames@danke</div>
      </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
import RestDAO from '../common/dao/restdao'
import PREVIEW_IMG from './project.svg'
import { Message, Row, Col, Tag, Button, Input, Select, Option, RadioGroup, RadioButton } from 'element-ui'
import { addAnimationStyle, createSheet } from './keyframe'
export default {
  name: 'FrameBox',
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Tag.name]: Tag,
    [Button.name]: Button,
    [Input.name]: Input,
    [RadioGroup.name]: RadioGroup,
    [RadioButton.name]: RadioButton,
    [Select.name]: Select,
    [Option.name]: Option
  },
  props: {
    isEdit: {
      type: Boolean
    },
    height: {
      default: 420
    },
    select: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      previewType: '方块',
      PREVIEW_IMG,
      tags: [],
      user: this.ctx.user,
      currentTag: null,
      currentAnimation: {
        name: 'none'
      },
      animations: []
    }
  },
  computed: {
    currentUseId () {
      if (this.ctx.user) {
        return this.ctx.user.id
      } else {
        return ''
      }
    },
    filteredAnimations () {
      return this.animations.filter(animation => animation.name.indexOf(this.filterKey) > -1)
    }
  },
  created () {
    this.sheet = createSheet()
    this.restdao = new RestDAO(this.ctx, 'danke/animation')
  },

  mounted () {
    this.loadAllTags()
    this.loadAnimation()
  },

  methods: {
    createFrame () {
      this.$router.replace('/frame/edit')
    },

    chooseTag (tag) {
      this.currentTag = tag
      this.loadAnimation()
    },
    async loadAllTags () {
      const tags = await this.restdao.distinct('tags')
      this.tags = tags
    },
    setAnimation (animation) {
      this.currentAnimation = {
        name: 'none'
      }
      addAnimationStyle(this.sheet, animation)
      this.$nextTick(() => {
        this.currentAnimation = animation
      })
    },
    async loadAnimation () {
      const query = {}
      if (this.currentTag) {
        query.tags = this.currentTag
      }
      query.count = 10000
      const response = await this.restdao.list(query)
      this.animations = response.list
      if (this.animations.length) {
        this.currentAnimation = this.animations[0]
      }
    },
    refreshFrame () {

    },

    async removeFrame () {
      await this.restdao.delete(this.currentAnimation)
      await this.loadAnimation()
      Message.success('删除成功')
    },
    editAnimation (animation) {
      this.$router.push('/frame/edit?id=' + animation._id)
    }
  }
}
</script>

<style lang="scss">
.frame-box-columns {
  height: 100%;
}

.frame-box {
  height: 100%;
  padding: 0 12px;
  background: #fff;
  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
    }
  }
}

.frame-tag {
  display: inline-block;
  margin: 0 5px;
  font-size: 12px;
  padding: 2px 8px;
  background: #f5f5f5;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background: #f1f1f1;
  }
  &.current {
    background: #00d1b2;
    color: #fff;
  }
}

.animations {
  border: 1px solid #eee;
  height: calc(100% - 36px);
  overflow: auto;
  .animation-item {
    display: flex;
    padding: 5px 10px;
    font-size: 12px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    line-height: 30px;
    .en-name {
      flex: 1;
    }
    &.is-active {
      background: #00c7ae;
      color: #fff;
    }
    &:hover {
      .el-button--text {
        color: #fff;
      }
      background: #00d1b2;
      color: #fff;
    }
  }
}

.op {
  float: right;
}
.frame-preview {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  perspective: 500px;
  overflow: hidden;
  &.shadow {
    background-image: linear-gradient(90deg, #592D2D, #592D2D);
    background-size: 160px 160px;
    background-position: center;
    background-repeat: no-repeat;
  }

  .toggle-type {
    position: absolute;
    left: .3rem;
    top: .3rem;
  }
  .preview-text {
    font-size: 2rem;
  }
  .edit-button {
    position: absolute;
    top: .3rem;
    right: .3rem;
  }
  .preview-box {
    width: 160px;
    height: 160px;
    background-color: #FF4B4B;
    perspective: 500px;
    -webkit-perspective: 500px;
  }
  .animation-provider {
    position: absolute;
    right: .5rem;
    bottom: .5rem;
    color: #999;
    font-size: 12px;
  }
}

</style>
