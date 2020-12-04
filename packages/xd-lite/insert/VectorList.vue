<template>
  <div>
    <van-skeleton v-if="fetching" title :row="6" />
    <van-grid clickable square :icon-size="48">
      <van-grid-item v-for="(vector, index) in vectors" :key="index" :icon="getImageUrl(vector.url)" @click="chooseVector(vector)">
        <div v-if="vector.html" class="svg-container" :style="getVariableStyle(vector.variables)">
          <div class="styled-box" v-html="vector.html">
          </div>
        </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import RestDAO from '../../utils/restdao'
import ImageDAO from '../../utils/imagedao'
import { getImageUrl } from '../../xd-builder/mixins/imageUtils'
import { getVariableStyle } from '../../xd-builder/mixins/renderUtils'

export default {
  name: "VectorList",
  props: {
    pack: {
      type: Object
    }
  },
  data () {
    return {
      fetching: false,
      vectors: []
    }
  },
  watch: {
    show () {
      this.showDialog = this.show
    }
  },
  created () {
    this.restdao = new RestDAO(this.ctx, 'danke/public/vector')
  },
  mounted () {
    this.onMounted()
  },
  methods: {
    getImageUrl,
    getVariableStyle,
    chooseVector (vector) {
      this.$emit('insert', vector)
    },
    async openPack (pack) {
      this.fetching = true
      const query = {
        page: 1,
        count: 500,
        pack: pack._id
      }
      const result = await this.restdao.list(query)
      this.vectors = result.list
      this.fetching = false
    },

    async onMounted () {
      if (this.pack) {
        this.openPack(this.pack)
      }
    }
  }
}
</script>

<style scoped>

</style>