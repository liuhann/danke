<template>
<div class="columns is-mobile is-multiline is-1 work-columns">
  <div
    v-for="work in works"
    :key="work.id"
    :class="work.ratio | workSize"
    class="column">
    <work-cover
      :work="work"
      :ratio="work.ratio"
      @link="shareLink(work)"
      @play="playWork(work)"
      @edit="chooseDraftWork(work)"/>
    <div class="work-info">
      <div class="work-title">
        {{ work.title }}
      </div>
      <div class="operation"><i
        class="icon-trash-empty"
        @click="deleteWork(work)"/></div>
    </div>
  </div>
</div>
</template>

<script>
import WorkCover from './WorkCover'
export default {
  name: 'WorksColumn',
  components: { WorkCover },
  props: {
    works: {
      type: Array
    }
  },
  filters: {
    workSize (ratio) {
      if (ratio === '16:9') {
        return ['is-half-mobile', 'is-one-quarter-tablet']
      } else if (ratio === '4:3') {
        return ['is-half-mobile', 'is-one-quarter-tablet']
      } else if (ratio === '9:16') {
        return ['is-one-third-mobile', 'is-2-tablet']
      }
    }
  },
  methods: {
    shareLink(work) {
      this.$emit('share-info', work)
    },
    playWork(work) {
      this.$emit('play', work)
    },
    chooseDraftWork(work) {
      this.$emit('edit', work)
    },
    deleteWork(work) {
      this.$emit('delete', work)
    }
  }
}
</script>

<style scoped>

</style>
