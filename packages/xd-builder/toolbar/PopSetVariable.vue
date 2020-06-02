<template>
<pop-wrapper
  title="调整"
  :width="360"
  icon="el-icon-date">

</pop-wrapper>
</template>

<script>
import PopWrapper from './PopWrapper'
import toolbarPopMixin from './toolbarPopMixin'
export default {
  name: 'PopSetVariable',
  mixins: [ toolbarPopMixin ],
  components: { PopWrapper }
}
</script>

<style scoped>

</style>
