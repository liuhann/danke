<template>
<div class="rest-list">
  <div class="columns is-mobile is-multiline is-gapless">
    <div class="column" :class="column" v-for="(item, index) in listData" :key="index">
      <slot name="item" v-bind:item="item">
        {{ item }}
      </slot>
    </div>
  </div>
  <el-pagination
    v-if="withPagination"
    background
    layout="prev, pager, next"
    :current-page.sync="pageNumber"
    :current-change="list"
    :page-size="20"
    :total="total">
  </el-pagination>
</div>
</template>

<script>
import RestDAO from '../dao/restdao'
import { Pagination } from 'element-ui'

export default {
  name: 'RestList',
  components: {
    [Pagination.name]: Pagination
  },
  props: {
    rest: {
      type: String
    },
    query: {
      type: Object
    },
    localList: {
      type: Array
    },
    column: {
      type: String,
      default: 'is-2-tablet is-one-third-mobile'
    },
    withPagination: {
      type: Boolean,
      default: true
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
      listData: []
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
      const result = await this.restdao.list(Object.assign({
        page: this.pageNumber,
        count: this.pageSize
      }, this.query))
      this.listData = result.list
      this.total = result.total
    },
    async nextPage () {
      this.pageNumber++
      this.list()
    },
    async previousPage () {
      if (this.pageNumber > 0) {
        this.pageNumber--
      }
      this.list()
    },
    async refresh () {
      this.pageNumber = 1
      this.list()
    },
    async closeList () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
