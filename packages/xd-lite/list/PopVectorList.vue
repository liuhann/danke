<template>
  <van-popup v-model="show" position="bottom" :style="{ height: '100%'}" @opened="openPack">
    <van-nav-bar>
      <template #right>
        <van-icon name="cross" size="22" @click="show = false" />
      </template>
      <template #left>
        {{ title }}
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
import { getImageUrl } from '../../utils/getImageUrl'
import { getVariableStyle } from '../../xd-builder/mixins/renderUtils'

export default {
  name: "PopVectorList",
  props: {
    title: {
      type: String,
      default: '添加图片素材'
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
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
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
      const pack = await this.packdao.getOne(this.pack)
      const result = await this.restdao.list(query)

      result.list.forEach(vector => vector.tags = pack.tags)
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
