<template>
  <van-popup v-model="show" title="Hi" position="bottom" :style="{ height: '100%'}">
    <van-nav-bar>
      <template #right>
        <van-icon name="close" size="20" @click="show = false" />
      </template>
      <template #left>
        请点击添加元素
      </template>
    </van-nav-bar>
    <van-skeleton v-if="fetching" title :row="6" />
    <van-grid clickable square :icon-size="48" column-num="6">
      <van-grid-item v-for="(vector, index) in vectors" :key="index" :icon="getImageUrl(vector.url)" @click="chooseVector(vector)">
        <div v-if="vector.html" class="svg-container" :style="getVariableStyle(vector.variables)">
          <div class="styled-box" v-html="vector.html">
          </div>
        </div>
      </van-grid-item>
    </van-grid>
  </van-popup>
</template>

<script>
import RestDAO from '../../utils/restdao'
import ImageDAO from '../../utils/imagedao'
import { getImageUrl } from '../../xd-builder/mixins/imageUtils'
import { getVariableStyle } from '../../xd-builder/mixins/renderUtils'

export default {
  name: "PopVectorList",
  props: {
    pack: {
      type: Object
    }
  },
  data () {
    return {
      show: false,
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
    open (pack) {
      this.show = true
      this.openPack(pack)
    },
    close () {
      this.show = false
    },
    getImageUrl,
    getVariableStyle,
    chooseVector (vector) {
      this.$emit('insert', vector)
    },
    async openPack (pack) {
      this.fetching = true
      this.vectors = []
      const query = {
        page: 1,
        count: 500,
        pack: pack
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

<style scoped lang="scss">

.svg-container {
  width: 80%;
  height: 80%;
  .styled-box {
    width: 100%;
    height: 100%;
  }
}
</style>
