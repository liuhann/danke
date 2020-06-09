<template>
  <pop-wrapper
    title="选择裁切图案"
    icon="el-icon-crop"
    :width="370"
    @show="loadMaskVectors"
  >
    <div v-if="!currentPack" class="packs-list">
      <div v-for="pack in maskPacks" :key="pack._id" class="pack">
        <div class="pack-title">
          <div class="text">
            {{ pack.name }}
          </div>
          <div class="more" @click="showPackVectors(pack)">
            查看全部
          </div>
        </div>
        <div v-if="pack.covers" class="pack-shapes">
          <div
            v-for="(cover, index) in pack.covers" :key="index"
            class="svg-item"
            @click="useMask(cover)"
          >
            <img :src="getImageUrl(cover.url, 120, 120)">
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentPack" class="pack-images">
      <div class="pack-title">
        <div class="text">
          {{ currentPack.name }}
        </div>
        <div class="more" @click="closePack">
          <el-button icon="el-icon-close" type="text" size="mini" />
        </div>
      </div>
      <div class="pack-shapes">
        <div
          v-for="(cover, index) in packMasks" :key="index"
          class="svg-item"
          @click="useMask(cover)"
        >
          <img :src="getImageUrl(cover.url, 120, 120)">
        </div>
      </div>
    </div>
  </pop-wrapper>
</template>

<script>
import toolbarPopMixin from './toolbarPopMixin'
import RestDAO from '../../common/dao/restdao'
import PopWrapper from './PopWrapper'
import { getImageUrl} from '../mixins/imageUtils'

export default {
  name: 'PopImageMask',
  components: {
    PopWrapper
  },
  mixins: [ toolbarPopMixin ],
  data () {
    return {
      currentPack: null,
      publicPacks: [],
      packMasks: [],
      myPacks: [],
    }
  },

  computed: {
    maskPacks () {
      return this.publicPacks.concat(this.myPacks)
    }
  },
  created () {
    this.packdao = new RestDAO(this.ctx, 'danke/pack')
    this.imagedao = new RestDAO(this.ctx, 'danke/image')
  },
  methods: {
    getImageUrl,
    async loadMaskVectors () {
      const result = await this.packdao.list({
        mask: true
      })
      this.publicPacks = result.list
      this.currentPack = null
    },
    useMask (cover) {
      this.$set(this.element, 'maskImage', `url(${this.getImageUrl(cover.url)})`)
    },

    closePack () {
      this.currentPack = null
    },

    async showPackVectors (pack) {
      this.packMasks = []
      this.currentPack = pack

      const result = await this.imagedao.list({
        album: this.currentPack._id,
        page: 0,
        count: 100
      })
      this.total = result.total
      result.list.forEach(image => {
        image.checked = false
      })
      this.packMasks = result.list
    }
  }
}
</script>

<style lang="scss">
.packs-list, .pack-images {
  .pack-title {
    color: #999;
    font-size: 16px;
    display: flex;
    .text {
      flex: 1;
    }
  }
  .pack-shapes {
    display: flex;
    flex-wrap: wrap;
    .svg-item {
      width: 120px;
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 80px;
        height: 80px;
      }
    }
  }
}

</style>
