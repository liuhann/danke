<template>
<el-dialog
  :width="width + 'px'"
  :title="title"
  :visible.sync="dialogVisible">
  <div class="field has-addons" v-for="(value, name) in object" :key="name">
    <p class="control">
      <a class="button is-static is-small">{{name}}</a>
    </p>
    <p class="control" style="width: 100%;">
      <input class="input is-small" v-model="object[name]">
    </p>
  </div>
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
import { Dialog } from 'element-ui'
export default {
  components: {
    'el-dialog': Dialog
  },
  name: 'FormEditDialog',
  props: {
    types: {
      type: Object
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
