<template>
  <div id="page-filter-edit" style="display: flex; margin: 3rem;">
    <el-form size="mini" label-width="90px" style="flex: 1;">
      <el-form-item label="名称">
        <el-input v-model="style.title" style="width: 360px;"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="style.category">
          <el-option label="过滤" value="filter" />
          <el-option label="修饰" value="addon" />
        </el-select>
      </el-form-item>
      <el-form-item label="类名">
        <el-input v-model="style.name" style="width: 360px;"></el-input>
      </el-form-item>
      <el-form-item label="样式文本">
        <div id="css">
        </div>
      </el-form-item>
      <el-form-item label="SVG">
        <div id="svg">
        </div>
      </el-form-item>
      <el-form-item label="变量信息">
        <el-button size="mini" @click="addVariable">增加</el-button>
        <div v-for="(variable, index) in style.variables" :key="index" class="variables" style="display:flex;">
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
          <el-button @click="removeVariable(index)">删除</el-button>
        </div>
      </el-form-item>
      <el-form-item label="">
        <el-button size="mini" type="primary" @click="refresh">刷新</el-button>
        <el-button size="mini" type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
    <div class="image-preview">
      <div class="element" :class="style.name">
        <img src="https://media-public.canva.cn/MADLFoi3fk0/1/screen.jpg">
      </div>
    </div>
    
    <div style="display:none">
      <svg v-for="(svgfilter, index) of svgFilters" :key="index" v-html="svgfilter">
      </svg>
    </div>
  </div>
</template>

<script>
import ace from 'brace'
import 'brace/mode/css'
import 'brace/mode/svg'
import 'brace/theme/monokai'
import StyleRegistry from '../xd-builder/utils/StyleRegistry.js'
import { Message, Form, FormItem, Input, Select, Option, Button } from 'element-ui'
import RestDAO from '../utils/restdao.js'
export default {
  name: 'StyleEdit',
  components: {
    [Form.name]: Form,
    [Input.name]: Input,
    [FormItem.name]: FormItem,
    [Button.name]: Button,
    [Select.name]: Select,
    [Option.name]: Option
  },
  data () {
    return {
      style: {
        title: '', // 标题 供描述使用
        name: '', // class 类名
        category: 'filter', // 效果分类
        cssContent: '', // css 正文
        svgContent: '',
        variables: [] // 变量替换列表
      },
      svgFilters: []
    }
  },
  watch: {
    'style.title': function (value) {
      if (this.style.name === '') {
        this.style.name = value
      }
      if (this.style.cssContent === '') {
        this.style.cssContent = '.' + value + ' {\n\r}'
      }
    }
  },
  created () {
    this.styledao = new RestDAO(this.ctx, 'danke/style')
  },
  mounted () {
    this.initEditor()
    this.styleRegistry = new StyleRegistry()
    if (this.$route.query.id) {
      this.loadStyle(this.$route.query.id)
    }
  },
  methods: {
    refresh () {
      this.styleRegistry.clear()
      this.style.cssContent = this.cssEditor.getValue()
      this.style.svgContent = this.svgEditor.getValue()

      this.styleRegistry.addStyle(this.style)
      this.svgFilters = this.styleRegistry.svgfilters
    },
    initEditor () {
      this.cssEditor = ace.edit('css')
      this.cssEditor.getSession().setMode('ace/mode/css')
      this.svgEditor = ace.edit('svg')
      this.svgEditor.getSession().setMode('ace/mode/svg')
    },
    async loadStyle (id) {
      this.style = await this.styledao.getOne(id)
      this.cssEditor.setValue(this.style.cssContent)
      this.svgEditor.setValue(this.style.svgContent)
    },
    addVariable () {
      this.style.variables.push({
        name: 'var',
        value: '#000',
        label: '',
        type: 'color'
      })
    },
    removeVariable (index) {
      this.style.variables.splice(index, 1)
    },
    async save () {
      if (!this.style.title) {
        Message.error('请输入名称')
        return
      }
      this.style.cssContent = this.cssEditor.getValue()
      this.style.svgContent = this.svgEditor.getValue()
      await this.styledao.createOrPatch(this.style)
      Message.success('保存成功')
      window.close()
    }
  }
}
</script>

<style lang="scss">
.image-preview {
  width: 600px;
  display: flex;
  margin-left: 20px;
  height: 100vh;
  justify-content: center;
  align-items: center;
  .element {
    position: relative;
    &::before {
      display: block;
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 1;
    }
    img {
      width: 360px;
    }
  }
}
#css, #svg {
  height: 240px;
  width: 100%;
}
.variables {
  margin: 20px 0;
}
.variables label {
  margin: 0 20px;
}
</style>
