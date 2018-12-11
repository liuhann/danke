<template>
  <tabs v-model="elementCollapseName" class="tabs-select-element">
    <tab title="基本元素">
      <cell title="图片" icon="photo" :clickable="true" label="可选择照片作为内容" @click="choose('image')"/>
      <cell title="文字" icon="edit" :clickable="true" label="可编辑的文字" />
    </tab>
    <tab title="图形元素">
      <cell title="圆形" :clickable="true" icon="check" />
      <cell title="方形" :clickable="true" icon="location" />
      <cell title="三角形" :clickable="true" icon="location" />
    </tab>
  </tabs>
</template>

<script>
import { Collapse, CollapseItem, Tab, Tabs, Cell } from 'vant'
const URLS = {
  picture: 'http://danke.cdn.bcebos.com/000/empty.png'
}
export default {
  name: 'ChooseAddElement',
  components: {
    Collapse,
    CollapseItem,
    Tab,
    Tabs,
    Cell
  },
  data () {
    return {
      URLS,
      elementCollapseName: 'basic'
    }
  },
  methods: {
    choose (name) {
      this.$emit('selected', name)
    }
  }
}
</script>

<style lang="less">
.tabs-select-element {
  width: 80vw;
  height: 60vh;
  overflow-y: auto;
}
</style>
