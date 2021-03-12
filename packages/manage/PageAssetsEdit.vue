<template>
  <div id="page-html-edit">
    <el-form size="mini" label-width="90px">
      <el-form-item label="Package">
        <el-input v-model="html.pack" />
      </el-form-item>
      <el-form-item v-if="html.type === 'text'" label="内容">
        <el-input v-model="html.text" />
      </el-form-item>
      <el-form-item label="HTML内容">
        <div id="editor" />
      </el-form-item>
      <el-form-item label="默认尺寸">
        <el-input-number v-model="html.w" /> x <el-input-number v-model="html.h" />
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
            <el-option value="deg" />
            <el-option value="px" />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="">
        <el-button size="mini" @click="preview">Preview</el-button>
        <el-button size="mini" @click="replaceFillColorWithVariables">replaceFillColorWithVariables</el-button>
        <el-button size="mini" @click="perserve">Preseve</el-button>
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
import ImageDAO from '../utils/imagedao.js'
import { getVariableStyle } from '../xd-builder/mixins/renderUtils'
import { getSVGViewBox, presets } from '../vectors/utils'
import { getImageUrl } from '../utils/getImageUrl.js'

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
        pack: '',
        title: '',
        w: 100,
        h: 100,
        html: '', //  正文
        variables: []
      }
    }
  },
  computed: {
    previewSnapshot () {
      if (this.html.s) {
        return getImageUrl(this.html.s)
      } else {
        return ''
      }
    },
    presets () {
      return presets
    },
    variableStyle () {
      return getVariableStyle(this.html.variables)
    }
  },
  watch: {},
  created () {
    this.dao = new RestDAO(this.ctx, 'danke/public/vector')
    this.imagedao = new ImageDAO(this.ctx)
  },
  mounted () {
    this.initEditor()
    if (this.$route.query.id) {
      this.load(this.$route.query.id)
    }
    if (this.$route.query.pack) {
      this.html.pack = this.$route.query.pack
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
      
      if (this.html.url && this.html.url.endsWith('.svg')) {
        const fetched = await fetch(getImageUrl((this.html.url)))
        const text = await fetched.text()

        this.html.html = text
      }
       this.editor.setValue(this.html.html)
     
    },
    addVariable () {
      this.html.variables.push({
        name: 'var',
        value: '#000',
        label: '颜色',
        type: 'color'
      })
    },

  
    perserve () {
      const svgValue = this.editor.getValue()
      const t = document.createElement('div')
      t.innerHTML = svgValue
      t.firstElementChild.setAttribute('preserveAspectRatio', 'none')
      t.firstElementChild.removeAttribute('width')
      t.firstElementChild.removeAttribute('height')
      t.firstElementChild.removeAttribute('width')

      const paths = t.firstElementChild.querySelectorAll('path')

      let inc = 1
      for (let path of paths) {
        const fill = path.getAttribute('fill')
        if (fill) {
          this.html.variables.push({
            name: 'c' + inc,
            value: fill,
            label: '颜色',
            type: 'color'
          })
          path.setAttribute('fill', `var(--c${inc})`)
          inc ++
        }
      }
      this.editor.setValue(t.innerHTML.replace(/<\!--.*?-->/g, ""))
    },

    /**
     * 替换指定Id 替换渐变定义 抽取颜色到变量之中
     */
    reFill () {
      let svg = this.editor.getValue()
      // replace color
      let colorMatches = svg.match(/stop-color=".+"/g)
      const color1 = colorMatches[0].substring(12, colorMatches[0].length - 1)
      const color2 = colorMatches[1].substring(12, colorMatches[1].length - 1)
      this.vector.variables[0].value = color1
      this.vector.variables[1].value = color2
      // replace id
      let originalId = svg.match(/url\(.+\)/g)[0].replace(/url\(#/g, '').replace(/\)/g, '')
      let replaced = svg.replace(new RegExp(originalId, 'gm'), this.vector.name).replace(color1, 'var(--gradientStart)').replace(color2, 'var(--gradientEnd)')
      this.editor.setValue(replaced)
    },

    /**
     * 获取及替换颜色操作
     */
    replaceFillColorWithVariables () {
      let rgbRegex = /[rR][gG][Bb][Aa]?[\\(]((2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?(0\\.\\d{1,2}|1|0)?[\\)]{1}/g
      let colorRegex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})|rgb[a]?\([^)]+\)/g
      let svg = this.editor.getValue()
      const colorMatched = svg.match(colorRegex);
      const colorList = Array.from(new Set(colorMatched))
      this.html.variables = []
      for (let i = 0; i < colorList.length; i++) {
        this.html.variables.push({
          'name': 'c' + i,
          'value': colorList[i],
          'label': '颜色',
          'type': 'color'
        })
        svg = svg.replace(new RegExp(colorList[i].replace('(', '\\(').replace(')', '\\)'), 'gm'), `var(--c${i})`)
      }
      this.editor.setValue(svg)
    },

    async preview () {
      this.html.html = this.editor.getValue()
      const viewbox = getSVGViewBox(this.html.html)
      this.html.w = viewbox.width
      this.html.h = viewbox.height
    },
    async save () {
      this.html.html = this.editor.getValue()
      delete this.html.content
      const result = await this.dao.createOrPatch(this.html)
      this.html._id = result._id
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
        width: 160px;
        height: 160px;
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
  height: 160px;
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
