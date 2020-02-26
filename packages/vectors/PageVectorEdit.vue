<template>
<section class="section" style="background: #dfdfdf;height: 100%">
    <div class="container" style="background: #fff;padding: 20px;box-shadow: 0 1px 5px 0 rgba(0,0,0,.1);">
      <el-form size="mini" label-width="90px">
        <el-form-item label="分类">
          <el-select  v-model="vector.category">
            <el-option value="background"/>
            <el-option value="clip"/>
            <el-option value="border"/>
            <el-option value="gradient"/>
          </el-select>
        </el-form-item>
        <el-form-item label="样式文本">
          <div id="editor">
          </div>
        </el-form-item>
        <el-form-item label="预览">
          {{vector._id}}
           <div class="styled-box" v-html="vector.content" :style="variableStyle">
          </div>
        </el-form-item>
        <el-form-item label="变量信息">
          <el-button size="mini" @click="addVariable">增加</el-button>
          <div class="variables" v-for="(variable, index) in vector.variables" :key="index" style="display:flex;">
            <label>标题</label>
            <span>
              <el-input v-model="variable.label"/>
            </span>
            <label>变量名</label>
            <span>
              <el-input v-model="variable.name"/>
            </span>
            <label>默认值</label>
            <span>
              <el-input v-if="variable.type==='number'" v-model.number="variable.value"/>
              <el-input v-else v-model="variable.value"/>
            </span>
            <label>类型</label>
            <el-select v-model="variable.type">
              <el-option value="color"/>
              <el-option value="number"/>
            </el-select>
          </div>
          </el-form-item>
          <el-form-item label="">
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
import RestDAO from '../common/dao/restdao'
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
      vector: {
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
  },
  methods: {
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
      alert(this.vector.content)
      await this.svgdao.createOrPatch(this.vector)
      Message.success('保存成功')
      window.close()
    }
  }
}
</script>

<style>
#editor {
  height: 400px;
}
.styled-box {
  width: 120px;
  height: 120px;

}
.variables {
  margin: 20px 0;
}
.variables label {
  margin: 0 20px;
}
</style>
