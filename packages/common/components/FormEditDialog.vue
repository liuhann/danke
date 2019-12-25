<template>
<el-dialog
  :width="width + 'px'"
  :title="title"
  :visible.sync="dialogVisible">
  <el-form :model="object" label-width="80px" size="mini">
    <el-form-item :label="labels[name] || name" v-for="(value, name) in objectForEdit" :key="name">
      <!--字符输入-->
      <el-input v-model="objectForEdit[name]" v-if="typeof objectForEdit[name] === 'string'"></el-input>
      <!--主要用于tag类的支持-->
      <el-select v-model="objectForEdit[name]" v-if="options[name]" multiple filterable allow-create>
        <el-option
          v-for="item in options[name]"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">确定</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </el-form-item>
  </el-form>
</el-dialog>
</template>

<script>
import { Dialog, Form, FormItem, Button, Input, Select, Option } from 'element-ui'
export default {
  components: {
    'el-dialog': Dialog,
    [Form.name]: Form,
    [Button.name]: Button,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
    [FormItem.name]: FormItem
  },
  name: 'FormEditDialog',
  props: {
    // 字段标签信息
    labels: {
      type: Object,
      default: function () {
        return {}
      }
    },
    options: {
      type: Object,
      default: function () {

      }
    },
    title: {
      type: String
    },
    width: {
      type: Number
    }
  },
  data () {
    return {
      dialogVisible: false,
      objectForEdit: {},
      object: {}
    }
  },
  methods: {
    open (object, title) {
      this.objectForEdit = Object.assign({}, object)
      delete this.objectForEdit._id
      delete this.objectForEdit.creator
      delete this.objectForEdit.created
      delete this.objectForEdit.updated
      delete this.objectForEdit.token
      this.object = object
      this.dialogVisible = true
    },
    async save () {
      Object.assign(this.object, this.objectForEdit)
      this.$emit('save', this.object)
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>

</style>
