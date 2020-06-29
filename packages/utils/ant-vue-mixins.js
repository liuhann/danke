import 'ant-design-vue/dist/antd.css'

import { FormModel, Upload, Button, Slider, Input, Table, message } from 'ant-design-vue'

export default {
  components: {
    Table,
    FormModel,
    Upload,
    Button,
    Input,
    Slider
  },
  created () {
    this.$message = message
  },
  methods: {
  }
}
