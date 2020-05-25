<template>
<section class="section" id="page-clip-edit" style="background: #dfdfdf;height: 100%">
    <div class="container" style="background: #fff;padding: 20px;box-shadow: 0 1px 5px 0 rgba(0,0,0,.1);">
      <el-form size="mini" label-width="90px">
        <el-form-item label="ID">
          <el-input v-model="object.name"/> <el-button @click="replaceClipPathId">更新ID</el-button>
        </el-form-item>
        <el-form-item label="原始长宽">
          <el-input v-model="object.width" type="number"/>
          <el-input v-model="object.height" type="number"/>
          <el-button @click="extractWidthHeight">计算</el-button>
        </el-form-item>
        <el-form-item label="样式文本">
          <div id="editor">
          </div>
        </el-form-item>
        <el-form-item label="预览">
           <div class="styled-box" v-html="object.content" :style="variableStyle">
          </div>
        </el-form-item>
        <el-form-item label="变量信息">
          <el-button size="mini" @click="addVariable">增加</el-button>
          <div class="variables" v-for="(variable, index) in object.variables" :key="index" style="display:flex;">
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
import { getSVGViewBox } from './utils'
export default {
  name: 'PageClippathEdit',
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
      object: {
        name: 'CP', // 名称 同时作为ID
        width: 0,
        height: 0,
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
      for (let variable of this.object.variables) {
        Object.assign(styles, {
          [`--${variable.name}`]: variable.value
        })
      }
      return styles
    }
  },
  watch: {},
  created () {
    this.dao = new RestDAO(this.ctx, 'danke/clippath')
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
      this.editor.getSession().setMode('ace/mode/svg')
      this.editor.setTheme('ace/theme/monokai')
    },
    replaceClipPathId () {
      this.editor.setValue(this.editor.getValue().replace(/id="[^"]+/i, 'id="' + this.object.name))
    },
    // 获取宽高
    extractWidthHeight () {
      Object.assign(this.object, getSVGViewBox(this.editor.getValue()))
    },
    async load (id) {
      this.object = await this.dao.getOne(id)
      this.editor.setValue(this.object.content)
    },
    addVariable () {
      this.object.variables.push({
        name: 'var',
        value: '#000',
        label: '',
        type: 'color'
      })
    },
    async save () {
      this.object.content = this.editor.getValue()
      await this.dao.createOrPatch(this.object)
      Message.success('保存成功')
      window.close()
    }
  }
}
</script>

<style lang="scss">
#page-clip-edit {
  .el-input--mini {
    width: 120px;
  }
}
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
