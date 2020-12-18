<template>
  <van-popup v-model="show" position="bottom" :style="{ height: '100%'}" @opened="openPack">
    <van-nav-bar>
      <template #right>
        <van-icon name="close" size="20" @click="show = false" />
      </template>
      <template #left>
        添加图片素材
      </template>
    </van-nav-bar>
    <van-skeleton v-if="fetching" title :row="6" />

    <van-grid clickable square :icon-size="32" column-num="4" :gutter="5">
      <van-grid-item v-for="(vector, index) in vectors" :key="index" @click="chooseVector(vector)">
        <van-image v-if="vector.url" width="100%" height="100%" :src="getImageUrl(vector.url)">
        </van-image>
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
      this.vectors = []
      this.pack = pack
    },
    close () {
      this.show = false
    },
    getImageUrl,
    getVariableStyle,
    chooseVector (vector) {
      this.$emit('insert', vector)
    },
    async openPack () {
      this.fetching = true
      this.vectors = []
      const query = {
        page: 1,
        count: 500,
        pack: this.pack
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

<style lang="scss">
.svg-container {
  width: 80%;
  height: 80%;
  .styled-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      flex: 1;
    }
  }
}
</style>
