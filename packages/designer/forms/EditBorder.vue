<template>
<div class="edit-border">
  <van-cell class="group-title" title="边框" icon="expand-o"/>
  <item-block title="宽度">
    <van-stepper v-model="border.width" :min="0"/>
  </item-block>
  <item-block title="样式">
    <select v-model="border.style">
      <option v-for="(value, key) of lineStyles" :value="key" :key="key">{{value}}</option>
    </select>
  </item-block>
  <item-block title="颜色">
    <pop-color-picker v-model="border.color"></pop-color-picker>
  </item-block>
  <item-block title="四边">
    <van-checkbox-group v-model="border.sides">
      <van-checkbox
        v-for="(value, key) of allSides"
        :key="key"
        :name="key">
        {{value}}
      </van-checkbox>
    </van-checkbox-group>
  </item-block>
  <item-block title="圆角" class="radius-setting">
    <van-stepper
      :min="0"
      v-model="border.radius[0]"
    />
    <van-stepper
      :min="0"
      v-model="border.radius[1]"
    />
    <van-stepper
      :min="0"
      v-model="border.radius[2]"
    />
    <van-stepper
      :min="0"
      v-model="border.radius[3]"
    />
    <van-button  plain size="small" @click="setRadiusSame">设为相同</van-button>
  </item-block>
</div>
</template>

<script>
import PopColorPicker from './PopColorPicker'
import ItemBlock from './ItemBlock'
const lineStyles = {
  solid: '实线',
  dotted: '虚点线',
  dashed: '虚划线',
  double: '双层',
  none: '无边框',
  inset: '嵌入线',
}
const allSides = {
  top: '上',
  bottom: '下',
  left: '左',
  right: '右'
}
export default {
  name: 'EditBorder',
  components: {
    ItemBlock,
    PopColorPicker
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  computed: {
    border () {
      return this.value
    },
    allSides () {
      return allSides
    },
    lineStyles() {
      return lineStyles
    }
  },
  watch: {
    'border': {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  methods: {
    setRadiusSame () {
      const val = this.value.radius[0]
      this.value.radius = [val, val, val, val]
      this.$emit('input', this.value)
    }
  }
}
</script>

<style lang="less">
.edit-border {
  .van-checkbox-group {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .van-checkbox {
      line-height: 32px;
      width: 50%;
    }
  }

  .radius-setting {
    display: flex;
    flex-wrap: wrap;
    .van-stepper {
      float: left;
      margin: 2px;
    }
  }
}
</style>
