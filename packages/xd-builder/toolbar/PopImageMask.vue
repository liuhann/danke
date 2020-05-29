<template>
<pop-wrapper
  title="选择裁切图案"
  icon="el-icon-picture-outline-round"
  @show="loadMaskVectors"
  width="360">
  <div class="packs-list">
    <div class="pack" v-for="pack in maskPacks" :key="pack._id">
      <div class="pack-title">
        <div class="text">{{pack.name}}</div>
        <div class="more" @click="showPackVectors(pack)">查看全部</div>
      </div>
      <div class="pack-shapes" v-if="pack.covers">
        <div
          v-for="(cover, index) in pack.covers" :key="index"
          @click="useMask(cover)"
          class="svg-item">
          <img :src="getImageUrl(cover.url, 120, 120)" />
        </div>
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
  mixins: [ toolbarPopMixin ],
  components: {
    PopWrapper
  },
  data () {
    return {
      publicPacks: [],
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
  },
  methods: {
    getImageUrl,
    async loadMaskVectors () {
      const result = await this.packdao.list({
        mask: true
      })
      this.publicPacks = result.list
    },
    useMask (cover) {
      this.$set(this.element, 'maskImage', `url(${this.getImageUrl(cover.url)})`)
    },
    showPackVectors () {

    }
  }
}
</script>

<style lang="scss">
.packs-list {
  .pack {
    .pack-title {
      display: flex;
      .text {
        flex: 1;
      }
    }
    .pack-shapes {
      display: flex;
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
}
</style>
