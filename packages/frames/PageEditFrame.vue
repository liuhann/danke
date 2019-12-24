<template>
<div>
  <nav-bar></nav-bar>
  <div class="section" style="background: #dfdfdf;">
    <div class="container" style="background: #fff;padding: 20px;box-shadow: 0 1px 5px 0 rgba(0,0,0,.1);">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form size="mini" label-width="90px">
            <el-form-item label="名称">
              <el-input v-model="animation.name" style="width: 360px;"></el-input>
            </el-form-item>
            <el-form-item label="持续时间">
              <el-input-number v-model.number="animation.duration" controls-position="right" :step="50" /> ms
            </el-form-item>
            <el-form-item label="过渡函数">
              <el-select v-model="animation.timing" size="mini" filterable>
                <el-option v-for="(value, key) in cubicBerziers" :value="value" :key="key" :label="key" />
              </el-select>
            </el-form-item>
            <el-form-item label="标签">
              <el-tag
                :key="tag"
                v-for="tag in animation.tags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="mini"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <el-button v-else type="text" class="button-new-tag" size="mini" @click="showInput" icon="el-icon-plus">标签</el-button>
            </el-form-item>
            <el-form-item label="样式文本">
              <el-input type="textarea" v-model="animation.cssFrame" :rows="10" />
            </el-form-item>
            <el-form-item label="SVG滤镜">
              <el-input type="textarea" v-model="animation.svgFilter" :rows="5" />
            </el-form-item>
            <el-form-item label="">
              <el-button size="mini" type="primary" @click="save">保存</el-button>
              <el-button size="mini" @click="cloneCreate">复制新增</el-button>
              <el-button v-if="animation._id" size="mini" type="danger" @click="remove">删除</el-button>
              <el-button size="mini" @click="play">预览</el-button>
              <el-button size="mini" type="text" @click="$router.replace('/frames')">返回</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <div style="margin: 0 auto;text-align: center;">
            <el-radio-group v-model="previewType" size="mini">
              <el-radio-button label="文字"></el-radio-button>
              <el-radio-button label="方块"></el-radio-button>
            </el-radio-group>
          </div>
          <div id="preview" :style="{background: previewType==='文字'? 'none': ''}" style="border-left: 1px solid #efefef;">
<!--            <div v-if="previewType==='方块'" class="preview-box" :class="boxClass" :style="frameStyle"></div>-->
            <div v-if="previewType==='文字'" class="preview-text" :class="boxClass" :style="frameStyle">frames@danke</div>
            <div v-if="previewType==='方块'" class="preview-box" :class="boxClass" :style="frameStyle">
              <img :src="PREVIEW_IMG" width="160" height="160" />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</div>
</template>

<script>
import { Message, Row, Col, Form, FormItem, Input, InputNumber, Select, Option, Radio, Tag, Button, RadioGroup, RadioButton } from 'element-ui'
import { createSheet, addAnimationStyle, clearAnimation } from './keyframe'
import PREVIEW_IMG from './project.svg'
import NavBar from '../site/components/NavBar'
import cubicBerziers from './model/cubic-beziers.js'
import RestDAO from '../common/dao/restdao'

export default {
  name: 'FrameTool',
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Tag.name]: Tag,
    [Form.name]: Form,
    [Input.name]: Input,
    [FormItem.name]: FormItem,
    [InputNumber.name]: InputNumber,
    [Button.name]: Button,
    [Select.name]: Select,
    [Option.name]: Option,
    [RadioGroup.name]: RadioGroup,
    [RadioButton.name]: RadioButton,
    [Radio.name]: Radio,
    NavBar
  },
  computed: {
    previewTypes () {
      return ['方块', '文字', '图片']
    }
  },
  data () {
    return {
      PREVIEW_IMG,
      cubicBerziers,
      // 动态增加标签相关处理
      inputVisible: false,
      inputValue: '',
      previewType: '文字',
      frameIndex: -1,
      frameStyle: '',
      boxClass: '',
      animation: {
        _id: '',
        name: 'my-animation',
        cssFrame: '',
        svgFilter: '',
        tags: [],
        duration: 400,
        iteration: 1,
        timing: 'linear'
      }
    }
  },
  watch: {
  },
  created () {
    this.framedao = new RestDAO(this.ctx, 'danke/animation')
  },
  mounted () {
    if (this.$route.query.id) {
      this.loadFrame(this.$route.query.id)
    }
  },
  methods: {
    async loadFrame (id) {
      const result = await this.framedao.getOne(id)
      this.animation = result
    },

    handleClose (tag) {
      this.animation.tags.splice(this.animation.tags.indexOf(tag), 1)
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.animation.tags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },

    /**
     * 播放预览动画
     */
    play () {
      if (this.sheet) {
        clearAnimation(this.sheet)
      }
      this.sheet = createSheet()
      this.boxClass = ''
      addAnimationStyle(this.sheet, this.animation)
      this.frameStyle = ''
      setTimeout(() => {
        this.boxClass = this.animation.name
      }, 300)
    },

    async remove () {
      await this.framedao.delete(this.animation)
      this.$router.replace('/frames')
    },

    cloneCreate () {
      this.animation._id = ''
    },

    async save () {
      if (!this.animation.name) {
        Message.error('请输入动画名称')
        return
      }
      const result = await this.framedao.createOrPatch(this.animation)
      this.animation._id = result.object._id
      if (result.code === 409) {
        Message.error('动画名称和现有的冲突')
      } else {
        Message.success('保存成功')
      }
    }
  }
}
</script>
<style lang="scss">
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.CodeMirror {
 border: 1px solid #efefef;
}
#preview {
  position: relative;
  background-image: linear-gradient(90deg, #aaa, #a4a4a4);
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 500px;
  background-size: 160px 160px;
  background-position: center;
  background-repeat: no-repeat;
  height: calc(100vh - 8rem);
  overflow: hidden;
  .preview-box {
    background-color: #666;
    width: 160px;
    height: 160px;
    overflow: hidden;
    box-sizing: border-box;
  }

  .clip-note {
    width: 160px;
    height: 160px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -80px;
    margin-top: -80px;
    .circle {
      position: absolute;
      width: 14px;
      height: 14px;
      background-color: #ef1;
      border-radius: 14px;
      transform: translateX(-50%) translateY(-50%);
    }
  }
  .preview-text {
    font-size: 2rem;
  }
  .toolbar {
    top: 0;
    position: absolute;
    width: 100%;
  }
}

@media screen and (max-width: 768px) {
  #preview {
    height: 320px;
    .toolbar {
      display: flex;
      margin: 0;
    }
  }
}
</style>
