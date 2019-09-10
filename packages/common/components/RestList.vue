<template>
<div class="rest-list">
  <div class="columns is-mobile is-multiline">
    <div class="column" :class="column" v-for="(item, index) in listData" :key="index">
      <slot name="item" v-bind:item="item">
        {{ item }}
      </slot>
    </div>
  </div>
  <nav class="pagination is-rounded" role="navigation" aria-label="pagination">
    <a class="pagination-previous"  @click="previousPage">上一页</a>
    <a class="pagination-next" @click="nextPage">下一页</a>
    <ul class="pagination-list">
      {{this.pageNumber}}/ {{this.total}}
    </ul>
  </nav>
</div>
</template>

<script>
import RestDAO from '../dao/restdao'

export default {
  name: 'RestList',
  props: {
    rest: {
      type: String
    },
    localList: {
      type: Array
    },
    column: {
      type: String,
      default: 'is-2-tablet is-one-third-mobile'
    },
    pageSize: {
      type: Number,
      default: 20
    }
  },
  data () {
    return {
      pageNumber: 1,
      total: 0,
      listData: [],
    }
  },
  mounted () {
    if (this.rest) {
      this.restdao = new RestDAO(this.ctx, this.rest)
      this.list()
    } else {
      this.listData = this.localList
    }
  },
  methods: {
    async list () {
      const result = await this.restdao.list({
        page: this.pageNumber,
        count: this.pageSize
      })
      this.listData = result.list
      this.total = result.total
    },
    async nextPage () {
      this.pageNumber ++
      this.list()
    },
    async previousPage () {
      if (this.pageNumber > 0) {
        this.pageNumber --
      }
      this.list()
    },
    async refresh () {
      this.pageNumber = 1
      this.list()
    }
  }
}
</script>

<style scoped>

</style>
