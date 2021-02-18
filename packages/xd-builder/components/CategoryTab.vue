<template>
  <div class="category-tab">
    <div v-for="tab of tabs" :key="tab.value" class="tabs" :class="value === tab.value? 'current': ''" @click="tabChange(tab.value)">
      <i :class="tab.icon" />
      <span>{{ tab.label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "CategoryTab",
  props: {
    tabs: {
      type: Array
    },
    value: {
      type: String
    }
  },
  methods: {
    tabChange (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="scss">
.category-tab {
  width: 76px;
  background: #0e1318;
  display: flex;
  flex-direction: column;
  .tab {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #aaacad;
    padding: 12px 0;
    &:hover {
       cursor: pointer;
       color: #ddd;
     }
    &.current {
       background: #293039;
     }
    i {
      margin: 2px 0 2px;
      font-size: 24px;
    }
    span {
      font-size: 14px;
      display: block;
    }
  }
}
</style>
