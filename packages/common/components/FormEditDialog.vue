<template>
<el-dialog
  :width="width + 'px'"
  :title="title"
  :visible.sync="dialogVisible">
  <el-form :model="object" label-width="80px">
    <el-form-item :label="key" v-for="(value, name) in object" :key="name">
      <el-input v-model="object[name]"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <a class="button is-small" @click="dialogVisible = false">
        取 消
    </a>
    <a class="button is-small is-primary" @click="save">
        确 定
    </a>
  </span>
</el-dialog>
</template>

<script>
import { Dialog, Form, FormItem, Button } from 'element-ui'
export default {
  components: {
    'el-dialog': Dialog,
    [Form.name]: Form,
    [Button.name]: Button,
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
      object: {}
    }
  },
  methods: {
    open (object, title) {
      this.object = object
      this.dialogVisible = true
    },
    async save () {
      this.$emit('save', this.object)
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>

</style>
