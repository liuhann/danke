<template>
<div class="edit-mask field-group">
  <div class="field has-addons">
    <div class="control field-lb">
      Mask
    </div>
    <div class="control">
      <span class="button is-small" @click="showMaskList = !showMaskList">选择</span>
    </div>
    <div class="control" v-if="mask.url">
      <span class="button is-small is-danger icon-trash-empty" @click="mask.url = ''"></span>
    </div>
    <div class="control">
      <div class="select is-small">
        <select v-model="mask.size">
          <option v-for="option in Sizes" :value="option.key" :key="option.key">{{option.value}}</option>
        </select>
      </div>
    </div>
  </div>
  <div class="mask-list-container">
    <rest-list v-if="showMaskList" rest="danke/vector" column="is-gapless">
      <template v-slot:item="{ item }">
        <figure class="image is-48x48 figure-vector" :style="{
          maskImage: 'url(' + IMG_SERVER + '/' + item.url + ')'
        }" @click="chooseMask(item)">
        </figure>
      </template>
    </rest-list>
  </div>
</div>
</template>

<script>
import EditLen from './EditLen.vue'
import { Sizes } from '../../../danke-core/css-model/mask'
import ColorPickr from '../ColorPickr.vue'
import RestList from '../../../common/components/RestList'
export default {
  name: 'EditMask',
  components: {
    RestList,
    EditLen,
    ColorPickr
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      showMaskList: false,
      IMG_SERVER: this.ctx.IMG_SERVER,
      Sizes
    }
  },
  computed: {
    mask () {
      return this.value
    }
  },
  created () {

  },
  watch: {

  },
  methods: {
    chooseMask (item) {
      this.mask.url = this.IMG_SERVER + '/' + item.url
    }
  }
}
</script>

<style lang="scss">
.edit-mask {
  .figure-vector {
    background-color: #00d1b2;
    -webkit-mask-size: cover;
  }
}

</style>
