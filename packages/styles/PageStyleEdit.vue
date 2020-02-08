<template>
<div class="section" style="background: #dfdfdf;">
    <div class="container" style="background: #fff;padding: 20px;box-shadow: 0 1px 5px 0 rgba(0,0,0,.1);">
      <el-form size="mini" label-width="90px">
        <el-form-item label="名称">
          <el-input v-model="style.title" style="width: 360px;"></el-input>
        </el-form-item>
        <el-form-item label="类名">
          <el-input v-model="style.name" style="width: 360px;"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="style.category" style="width: 360px;"></el-input>
        </el-form-item>
        <el-form-item label="样式文本">
          <el-input type="textarea" v-model="style.cssContent" :rows="10" />
        </el-form-item>
        <el-form-item label="变量信息">
          <el-button size="mini" @click="addVariable">增加</el-button>
          <div class="variables" v-for="(variable, index) in style.variables" :key="index" style="display:flex;">
            <label>变量名</label>
            <span>
              <el-input v-model="variable.name"/>
            </span>
            <label>默认值</label>
            <span>
            <el-input v-model="variable.value"/>
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
</div>
</template>

<script>
import { Message, Form, FormItem, Input, Select, Option, Button } from 'element-ui'
import RestDAO from '../common/dao/restdao'
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
        category: '', // 效果分类
        cssContent: '', // css 正文
        variables: [] // 变量替换列表
      }
    }
  },
  created () {
    this.styledao = new RestDAO(this.ctx, 'danke/style')
  },
  mounted () {
    if (this.$route.query.id) {
      this.loadStyle(this.$route.query.id)
    }
  },
  methods: {
    async loadStyle (id) {
      this.style = await this.styledao.getOne(id)
    },
    addVariable () {
      this.style.variables.push({
        name: 'var',
        value: '#000',
        type: 'color'
      })
    },
    async save () {
      if (!this.style.title) {
        Message.error('请输入名称')
        return
      }
      await this.styledao.createOrPatch(this.style)
      Message.success('保存成功')
    }
  }
}
</script>

<style>
.variables {
  margin: 20px 0;
}
.variables label {
  margin: 0 20px;
}
</style>
