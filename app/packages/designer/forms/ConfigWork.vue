<template>
<div class="config-work">
  <van-nav-bar title="作品配置" @click-left="close">
    <van-icon name="cross" slot="left" />
  </van-nav-bar>

  <van-row>
    <van-col>
      <van-button size="normal" @click="tapPreviewPlay">播放</van-button>
    </van-col>
    <van-col>
      <van-button size="normal">保存</van-button>
    </van-col>
  </van-row>

  <edit-background v-model="work.background"></edit-background>

  <item-block title="翻页">
    <van-radio-group v-model="work.turning.type">
      <van-radio name="auto">自动</van-radio>
      <van-radio name="trigger">手动</van-radio>
    </van-radio-group>
  </item-block>

  <item-block title="时间" v-if="work.turning.type==='auto'">
    <van-stepper v-model="work.turning.delay" integer disable-input :step="50"/>
  </item-block>

</div>
</template>

<script>
import ItemBlock from './ItemBlock'
import EditBackground from './EditBackground'
import EditImage from './EditImage'
export default {
  name: 'ConfigWork',
  components: {
    EditImage,
    EditBackground,
    ItemBlock
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      work: this.value
    }
  },
  watch: {
    work (val) {
      this.$emit('input', val)
    }
  },

  created () {
  },

  methods: {
    close () {
      this.$emit('close')
    },

    tapPreviewPlay () {
      this.$emit('preview')
    }
  }
}
</script>

<style lang="less">
.scene-edit-wrapper {

}
</style>
