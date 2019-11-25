<template>
<div class="columns is-mobile is-multiline work-columns">
  <div
    v-for="work in works"
    :key="work.id"
    :class="work.ratio | workSize"
    class="column">
    <div class="cover-container">
      <div class="device">
        <work-cover
          :work="work"
          :ratio="work.ratio"
          :height="0"
          @link="shareLink(work)"
          @play="playWork(work)"
          @edit="chooseDraftWork(work)"/>
        <div class="work-info" style="height: 36px;">
          <a v-if="work.creator === userId" class="button is-white has-text-danger is-pulled-right" @click='deleteWork(work)'>
            <span class="icon">
              <i class="icon-trash-empty"></i>
            </span>
          </a>
          <span class="button is-white has-text-info is-pulled-right" @click='chooseDraftWork(work)'>
            <span class="icon">
              <i class="icon-pencil"></i>
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import WorkCover from './WorkCover.vue'
export default {
  name: 'WorksColumn',
  components: { WorkCover },
  props: {
    works: {
      type: Array
    }
  },
  computed: {
    userId () {
      if (this.ctx.user) {
        return this.ctx.user.id
      } else {
        return ''
      }
    }
  },
  filters: {
    workSize (ratio) {
      if (ratio === '16:9') {
        return ['is-half-mobile', 'is-one-quarter-tablet']
      } else if (ratio === '4:3') {
        return ['is-half-mobile', 'is-one-quarter-tablet']
      } else if (ratio === '9:16') {
        return ['is-half-mobile', 'is-one-fifth-tablet']
      }
    }
  },
  methods: {
    shareLink (work) {
      this.$emit('share-info', work)
    },
    playWork (work) {
      this.$emit('play', work)
    },
    chooseDraftWork (work) {
      this.$emit('edit', work)
    },
    deleteWork (work) {
      this.$emit('delete', work)
    }
  }
}
</script>

<style lang="scss">
.cover-container {
  padding: 10px;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.07);
}
</style>
