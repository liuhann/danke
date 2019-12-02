<template>
<div class="edit-fliping">
  <edit-image v-model="element.front" @blob="frontUpdated"></edit-image>
  <edit-image v-model="element.back" @blob="frontUpdated"></edit-image>
  <div class="field has-addons">
    <div class="control field-lb">
      方向
    </div>
    <div class="control">
      <el-select v-model="element.rotate" size="mini">
        <el-option v-for="opt in flipRotations" :label="opt.label" :value="opt.value" />
      </el-select>
    </div>
  </div>
  <div class="field has-addons">
    <div class="control field-lb">
      翻转
    </div>
    <div class="control">
      <edit-len v-model.number="element.speed" :with-unit="false"></edit-len>
    </div>
    <div class="control field-lb">
      延迟
    </div>
    <div class="control">
      <edit-len v-model.number="element.delay" :with-unit="false"></edit-len>
    </div>
  </div>
</div>
</template>

<script>
import { Select, Option, Input } from 'element-ui'
import EditLen from '../../xd-builder/components/props/EditLen.vue'
import EditImage from '../../xd-builder/components/props/EditImage.vue'
export default {
  name: 'EditFlip',
  components: {
    EditLen,
    EditImage,
    [Select.name]: Select,
    [Input.name]: Input,
    [Option.name]: Option
  },
  props: {
    element: {
      type: Object
    }
  },
  data () {
    return {
      flipRotations: [{
        label: '横向',
        value: 'x'
      }, {
        label: '纵向',
        value: 'y'
      }]
    }
  },
  computed: {

  },
  methods: {
    frontUpdated () {

    }
  }
}
</script>

<style scoped>

</style>
