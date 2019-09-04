<template>
<el-dialog title="选择遮罩" :visible.sync="dialogVisible">
  <rest-list rest="danke/vector">
    <template v-slot:item="{ item }">
      <figure class="image is-48x48 figure-vector" :style="{
          maskImage: 'url(' + IMG_SERVER + '/' + item.url + ')'
        }">
      </figure>
    </template>
  </rest-list>
</el-dialog>
</template>

<script>
import RestList from '../common/components/RestList'
import { Dialog } from 'element-ui'
export default {
  name: 'DialogChooseVector',
  components: { Dialog, RestList },
  data() {
    return {
      dialogVisible: false,
      IMG_SERVER: this.ctx.IMG_SERVER
    }
  }
}
</script>

<style scoped>

</style>
