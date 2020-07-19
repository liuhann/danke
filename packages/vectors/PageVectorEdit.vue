<template>
  <section class="section" style="background: #dfdfdf;">
    <div class="container" style="background: #fff;padding: 20px;box-shadow: 0 1px 5px 0 rgba(0,0,0,.1);">
      <el-form size="mini" label-width="90px">
        <el-form-item label="ID">
          <el-input v-model="vector.name" />
        </el-form-item>
        <el-form-item label="样式文本">
          <div id="editor">
          </div>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="vector.album" size="mini" allow-create filterable>
            <el-option v-for="album in albums" :key="album" :value="album" />
          </el-select>
        </el-form-item>
        <el-form-item label="预览">
          <div class="styled-box" :style="variableStyle" v-html="vector.content">
          </div>
        </el-form-item>
        <el-form-item label="变量信息">
          <el-button size="mini" @click="addVariable">增加</el-button>
          <div v-for="(variable, index) in vector.variables" :key="index" class="variables" style="display:flex;">
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
          <el-button size="mini" @click="reFill">数据填充</el-button>
          <el-button size="mini" @click="replaceFillColorWithVariables">replaceFillColorWithVariables</el-button>
          <el-button size="mini" type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
import ace from 'brace'
import 'brace/mode/svg'
import 'brace/theme/monokai'
import { Message, Form, FormItem, Input, Select, Option, Button } from 'element-ui'
import RestDAO from '../utils/restdao.js'
export default {
  name: 'PageSVGEdit',
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
      albums: [],
      vector: {
        name: '',
        album: '',
        category: '', // 效果分类
        content: '', //  正文
        variables: [{
          'name': 'gradientStart',
          'value': '#06f',
          'label': '起始颜色',
          'type': 'color'
        }, {
          'name': 'gradientEnd',
          'value': '#FFA4D8',
          'label': '结束颜色',
          'type': 'color'
        }]
      }
    }
  },
  computed: {
    variableStyle () {
      const styles = {}
      for (let variable of this.vector.variables) {
        Object.assign(styles, {
          [`--${variable.name}`]: variable.value
        })
      }
      return styles
    }
  },
  watch: {},
  created () {
    this.svgdao = new RestDAO(this.ctx, 'danke/svg')
  },
  mounted () {
    this.initEditor()
    if (this.$route.query.id) {
      this.loadSvg(this.$route.query.id)
    }
    this.loadSvgAlbums()
  },
  methods: {
    async loadSvgAlbums () {
      this.albums = await this.svgdao.distinct('album')
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
      this.vector.variables = []
      for (let i = 0; i < colorList.length; i++) {
        this.vector.variables.push({
          'name': 'fillColor' + i,
          'value': colorList[i],
          'label': '颜色' + i,
          'type': 'color'
        })
        svg = svg.replace(new RegExp(colorList[i].replace('(', '\\(').replace(')', '\\)'), 'gm'), `var(--fillColor${i})`)
      }
      this.editor.setValue(svg)
    },

    replaceId () {
      this.editor.setValue(this.editor.getValue().replace(/id="[^"]+/i, 'id="' + this.vector.name))
    },
    initEditor () {
      this.editor = ace.edit('editor')
      this.editor.getSession().setMode('ace/mode/svg')
      this.editor.setTheme('ace/theme/monokai')
    },
    async loadSvg (id) {
      this.vector = await this.svgdao.getOne(id)
      this.editor.setValue(this.vector.content)
    },
    addVariable () {
      this.vector.variables.push({
        name: 'var',
        value: '#000',
        label: '',
        type: 'color'
      })
    },
    async save () {
      this.vector.content = this.editor.getValue()
      const result = await this.svgdao.createOrPatch(this.vector)
      if (result.code === 409) {
        Message.error('ID重复')
      } else {
        Message.success('保存成功')
        window.close()
      }
    }
  }
}
</script>

<style lang="scss">
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
}
.variables label {
  margin: 0 20px;
}
</style>
