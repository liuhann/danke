<template>
<pop-wrapper
  title="设置过滤效果"
  icon="el-icon-set-up"
  @show="initFilter"
  :width="360">
  <div class="filter-item" v-for="filter in filters" :key="filter.name">
    <el-checkbox v-model="filter.enabled">{{filter.title}}</el-checkbox>
    <el-input-number :disabled="!filter.enabled" size="mini" controls-position="right" v-model="filter.value" :step="filter.step || 1"/>
  </div>
  <el-button type="success" size="mini" @click="setElementFilter">设置</el-button>
</pop-wrapper>
</template>

<script>


import toolbarPopMixin from './toolbarPopMixin'

const defaultFilter = [{
  name: 'grayscale',
  enabled: false,
  title: '灰度',
  value: 0,
  end: '%'
}, {
  title: '亮度',
  enabled: false,
  name: 'brightness',
  value: 1,
  step: .01
}, {
  enabled: false,
  title: '对比度',
  name: 'contrast',
  value: 100,
  end: '%'
}, {
  enabled: false,
  title: '模糊',
  name: 'blur',
  value: 0,
  end: 'px'
}, {
  enabled: false,
  title: '透明度',
  name: 'opacity',
  value: 100,
  end: '%'
}, {
  enabled: false,
  title: '饱和度',
  name: 'saturate',
  value: 100,
  end: '%'
}]
export default {
  name: 'PopSetFilter',
  mixins: [ toolbarPopMixin ],
  data () {
    return {
      filters: JSON.parse(JSON.stringify(defaultFilter))
    }
  },
  methods: {
    initFilter () {
      this.filters = JSON.parse(JSON.stringify(defaultFilter))
      if (this.element.style.filter) {
        const elementFilters = this.element.style.filter.split(' ')
        for (let elementFilter of elementFilters) {
          let name = elementFilter.match(/[a-z]+/g)[0]
          let value = parseInt(elementFilter.match(/[0-9]+/g)[0])
          let filter = this.filters.filter(f => f.name === name)[0]

          filter.value = value
          filter.enabled = true
        }
      }
    },
    setElementFilter () {
      const filters = []
      for (let filter of this.filters) {
        if (filter.enabled) {
          filters.push(`${filter.name}(${filter.value}${filter.end})`)
        }
      }
      console.log(filters)
      this.$set(this.element.style, 'filter', filters.join(' '))
    }
  }
}
</script>

<style lang="scss">
.filter-item {
  display: flex;
  margin-bottom: 10px;
  .el-checkbox {
    width: 80px;
    margin-right: 10px;
  }
}
</style>
