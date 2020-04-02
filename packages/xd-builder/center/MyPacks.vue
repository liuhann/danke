<template>
<div id="my-packs">
  <div class="content-title">
    <span>我的设计图库</span>
    <button @click="newPack">新增</button>
  </div>
  <div class="pack-container">

  </div>

</div>
</template>

<script>
import { Dialog } from 'element-ui'
export default {
  name: 'MyPacks',
  components: {
    [Dialog.name]: Dialog
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    newPack () {

    }
  }
}
</script>

<style lang="scss">
#my-packs {
  .content-title {
    button {
      margin-left: 20px;
    }
  }
}
</style>