<template>
  <div>
    <div class="section" style="background: #dfdfdf;">
      <div class="container" style="background: #fff;padding: 20px;box-shadow: 0 1px 5px 0 rgba(0,0,0,.1);">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form size="mini" inline label-width="90px">
              <el-form-item label="一级分类">
                <el-select v-model="animation.type" size="mini" @change="loadTypeGroup">
                  <el-option v-for="type in types" :key="type.label" :label="type.label" :value="type.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="二级分类">
                <el-select v-model="animation.group" size="mini" allow-create filterable>
                  <el-option v-for="group in groups" :key="group" :label="group" :value="group" />
                </el-select>
              </el-form-item>
              <el-form-item label="方向">
                <el-select v-model="animation.direction" size="mini" allow-create filterable>
                  <el-option v-for="d in directions" :key="d" :label="d" :value="d" />
                </el-select>
              </el-form-item>
              <el-form-item label="名称">
                <el-input v-model="animation.name" style="width: 360px;" />
              </el-form-item>
              <el-form-item label="持续时间">
                <el-input-number v-model.number="animation.duration" controls-position="right" :step="50" /> ms
              </el-form-item>
              <el-form-item label="次数">
                <el-input-number v-model.number="animation.iteration" :disabled="animation.infinite" controls-position="right" />
                <el-checkbox v-model="animation.infinite" style="margin-left: 20px;">
                  循环
                </el-checkbox>
              </el-form-item>
              <el-form-item label="过渡函数">
                <el-select v-model="animation.timing" size="mini" filterable>
                  <el-option v-for="(value, key) in cubicBerziers" :key="key" :value="value" :label="key" />
                </el-select>
              </el-form-item>
            </el-form>
            <el-form size="mini" label-width="90px">
              <el-form-item label="样式文本">
                <div id="editor" />
              </el-form-item>
              <el-form-item label="变量信息">
                <el-button size="mini" @click="addVariable">
                  增加
                </el-button>
                <div v-for="(variable, index) in animation.variables" :key="index" class="variables" style="display:flex;">
                  <label>标题</label>
                  <span>
                    <el-input v-model="variable.label" />
                  </span>
                  <label>变量名</label>
                  <span>
                    <el-input v-model="variable.name" />
                  </span>
                  <label>默认值</label>
                  <span>
                    <el-input v-model="variable.value" />
                  </span>
                  <label>类型</label>
                  <el-select v-model="variable.type">
                    <el-option value="color" />
                    <el-option value="deg" />
                    <el-option value="number" />
                    <el-option value="px" />
                    <el-option value="percent" />
                  </el-select>
                  <el-button type="text" icon="el-icon-delete" @click="removeVariable(index)" />
                </div>
              </el-form-item>
              <el-form-item label="">
                <el-button size="mini" type="primary" @click="save">
                  保存
                </el-button>
                <el-button size="mini" @click="cloneCreate">
                  复制新增
                </el-button>
                <el-button v-if="animation._id" size="mini" type="danger" @click="remove">
                  删除
                </el-button>
                <el-button size="mini" @click="play">
                  预览
                </el-button>
                <el-button size="mini" type="text" @click="$router.replace('/frames')">
                  返回@
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <div style="margin: 0 auto;text-align: center;">
              <el-radio-group v-model="previewType" size="mini">
                <el-radio-button label="文字" />
                <el-radio-button label="方块" />
              </el-radio-group>
            </div>
            <div id="preview" :style="{background: previewType==='文字'? 'none': ''}" style="border-left: 1px solid #efefef;">
              <div v-if="previewType==='文字'" class="preview-text" :class="boxClass" :style="frameStyle">
                frames@danke
              </div>
              <div v-if="previewType==='方块'" class="preview-box" :style="frameStyle">
                <preview-image :class="boxClass" />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { Message, Row, Col, Form, FormItem, Input, InputNumber, Select, Option, Radio, Tag, Button, RadioGroup, RadioButton, Checkbox } from 'element-ui'
import { createSheet, addAnimationStyle, clearAnimation } from './keyframe'
import PreviewImage from './project.svg'
import ace from 'brace'
import 'brace/mode/css'
import 'brace/theme/monokai'
import cubicBerziers from './model/cubic-beziers.js'
import RestDAO from '../utils/restdao.js'
import types from './types'
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
    [Checkbox.name]: Checkbox,
    PreviewImage
  },
  data () {
    return {
      types,
      cubicBerziers,
      // 动态增加标签相关处理
      inputVisible: false,
      inputValue: '',
      previewType: '方块',
      frameIndex: -1,
      frameStyle: '',
      boxClass: '',
      groups: [],
      directions: ['向上', '向下', '向左', '向右', '向前', '向后', '对角'],
      animation: {
        _id: '',
        type: '',
        group: '',
        name: 'my-animation',
        cssFrame: '',
        svgFilter: '',
        duration: 400,
        iteration: 1,
        infinite: false,
        variables: [],
        timing: 'linear'
      }
    }
  },
  computed: {
    previewTypes () {
      return ['方块', '文字', '图片']
    }
  },
  watch: {
  },
  created () {
    this.framedao = new RestDAO(this.ctx, 'danke/animation')
  },
  mounted () {
    this.initEditor()
    this.loadTypeGroup()
    if (this.$route.query.id) {
      this.loadFrame(this.$route.query.id)
    }
  },
  methods: {
    initEditor () {
      this.editor = ace.edit('editor')
      this.editor.getSession().setMode('ace/mode/css')
      this.editor.setTheme('ace/theme/monokai')
    },
    async loadFrame (id) {
      const result = await this.framedao.getOne(id)
      this.editor.setValue(result.cssFrame)
      if (result.variables == null) {
        result.variables = []
      }
      this.animation = result
    },
    async loadTypeGroup () {
      const result = await this.framedao.distinct('group')
      this.groups = result
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

    addVariable () {
      this.animation.variables.push({
        name: 'var',
        value: '#000',
        label: '',
        type: 'color'
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

      this.animation.cssFrame = this.editor.getValue()
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

    removeVariable (index) {
      this.animation.variables.splice(index, 1)
    },

    cloneCreate () {
      this.animation.name = ''
      this.animation._id = ''
    },

    async save () {
      if (!this.animation.name) {
        Message.error('请输入动画名称')
        return
      }
      this.animation.cssFrame = this.editor.getValue()
      const result = await this.framedao.createOrPatch(this.animation)
      if (result.code === 409) {
        Message.error('动画名称和现有的冲突')
      } else {
        Message.success('保存成功')
        setTimeout(() => {
          window.close()
        }, 500)
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
#editor {
  height: 400px;
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
    --width: 160px;
    --height: 160px;
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
