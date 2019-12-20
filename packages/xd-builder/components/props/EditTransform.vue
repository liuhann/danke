<template>
  <div class="edit-transform">
    <div class="field has-addons">
      <div class="control field-lb">
         变换
      </div>
      <div class="control">
        <el-button @click="addTransform" size="mini">增加</el-button>
      </div>
    </div>

    <div class="field has-addons" v-for="(transform, index) of transforms" :key="index">
      <div class="control field-lb">
      </div>
      <div class="control" style="width: 100px">
        <el-select v-model="transform.key" size="mini">
          <el-option v-for="transformKey of transformKeys" :label="transformKey.label" :value="transformKey.value"/>
        </el-select>
      </div>
      <div class="control" style="width: 80px">
        <el-input-number v-model.number="transform.value" size="mini" controls-position="right"/>
      </div>
      <div class="control" style="width: 30px">
        <el-button type="text" style="color: red;" icon="el-icon-delete" @click="transforms.splice(index, 1)" size="mini"/>
      </div>
    </div>

</div>
</template>

<script>
import { Button, Select, Option, InputNumber } from 'element-ui'
import { transformKeys } from '../../../danke-core/css-model/transform'
export default {
  name: 'EditTransform',
  components: {
    [Button.name]: Button,
    [Select.name]: Select,
    [InputNumber.name]: InputNumber,
    [Option.name]: Option
  },
  props: {
    transforms: {
      type: Object
    }
  },
  data () {
    return {
      transformKeys
    }
  },
  methods: {
    addTransform () {
      this.transforms.push({
        key: '',
        value: 0
      })
    }
  }
}
</script>

<style lang="scss">
.transform-xyz {
  display: flex;
  .field {
    margin: 0;
  }
  input {
    margin-right: 5px;
    width: 70px;
  }
}
</style>
