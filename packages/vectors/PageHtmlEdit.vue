<template>
  <div id="page-html-edit">
    <el-form size="mini" label-width="90px">
      <el-form-item label="HTML内容">
        <div id="editor">
        </div>
      </el-form-item>
      <el-form-item label="默认尺寸">
        <el-input-number v-model="html.width" /> x <el-input-number v-model="html.height" />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="html.tags" size="mini" allow-create filterable multiple>
          <el-option v-for="key in presets" :key="key" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item label="变量信息">
        <el-button size="mini" @click="addVariable">增加</el-button>
        <div v-for="(variable, index) in html.variables" :key="index" class="variables" style="display:flex;">
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
            <el-input v-if="variable.type==='number'" v-model.number="variable.value" />
            <el-input v-else v-model="variable.value" />
          </span>
          <label>类型</label>
          <el-select v-model="variable.type">
            <el-option value="color" />
            <el-option value="number" />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="">
        <el-button size="mini" @click="preview">Preview</el-button>
        <el-button size="mini" type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
    <div class="preview">
      <div class="preview-container">
        <div class="preview" :style="variableStyle" v-html="html.html"></div>
      </div>
    </div>
  </div>
</template>

<script>
import ace from 'brace'
import 'brace/mode/html'
import 'brace/theme/monokai'
import { Message, Form, FormItem, Input, Select, Option, Button, InputNumber } from 'element-ui'
import RestDAO from '../utils/restdao.js'
import { getSVGViewBox, presets } from './utils'

export default {
  name: 'PageHtmlEdit',
  components: {
    [Form.name]: Form,
    [InputNumber.name]: InputNumber,
    [Input.name]: Input,
    [FormItem.name]: FormItem,
    [Button.name]: Button,
    [Select.name]: Select,
    [Option.name]: Option
  },
  data () {
    return {
      albums: [],
      html: {
        title: '',
        width: 100,
        height: 100,
        html: '', //  正文
        styles: '',
        tags: ['SVG', '动画'],
        variables: [{
          name: 'color',
          type: 'color',
          value: '#FF6700',
          label: ''
        }]
      }
    }
  },
  computed: {
    presets () {
      return presets
    },
    variableStyle () {
      const styles = {}
      for (let variable of this.html.variables) {
        Object.assign(styles, {
          [`--${variable.name}`]: variable.value
        })
      }
      return styles
    }
  },
  watch: {},
  created () {
    this.dao = new RestDAO(this.ctx, 'danke/h5')
  },
  mounted () {
    this.initEditor()
    if (this.$route.query.id) {
      this.load(this.$route.query.id)
    }
  },
  methods: {
    initEditor () {
      this.editor = ace.edit('editor')
      this.editor.getSession().setMode('ace/mode/html')
      this.editor.setTheme('ace/theme/monokai')
    },
    async load (id) {
      this.html = await this.dao.getOne(id)
      this.editor.setValue(this.html.html)
    },
    addVariable () {
      this.html.variables.push({
        name: 'var',
        value: '#000',
        label: '',
        type: 'color'
      })
    },
    async preview () {
      this.html.html = this.editor.getValue()
      Object.assign(this.html, getSVGViewBox(this.html.html))
    },
    async save () {
      this.html.html = this.editor.getValue()
      delete this.html.content
      debugger
      const result = await this.dao.update(this.html)
      Message.success('保存成功')
    }
  }
}
</script>

<style lang="scss">
#page-html-edit {
  width: 95%;
  margin: 20px auto;
  display: flex;
  .preview {
    flex: 1;
    padding: 20px;
    box-sizing: border-box;
    min-height: 300px;
    .preview-container {
      border: 1px solid #eee;
      height: 100%;
      .preview {
        width: 100%;
        height: 100%;
        div {
          height: 100%;
        }
      }
    }
  }
  .el-form {
    flex: 2;
  }
}
#editor {
  height: 400px;
}
.styled-box {
  width: 120px;
  height: 120px;
  svg {
    height: 120px;
    width: 120px;
  }
}
.variables {
  margin: 20px 0;
  .el-input {
    width: 80px;
  }
}
.variables label {
  margin: 0 20px;
}
</style>
