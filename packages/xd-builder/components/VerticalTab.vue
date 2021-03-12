<template>
  <div class="vertical-tab">
    <div class="tabs-container">
      <div v-for="tab of tabs" :key="tab.value" class="tab-item" :class="value === tab.value? 'current': ''" @click="tabChange(tab.value)">
        <i v-if="tab.icon.indexOf('http')===-1" :class="tab.icon" />
        <img v-if="tab.icon.indexOf('http')>-1" :src="tab.icon">
        <span>{{ tab.label }}</span>
      </div>
    </div>
    <div class="hover-focus">
    </div>
  </div>
</template>

<script>
export default {
  name: "VerticalTab",
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
.vertical-tab {
  width: 64px;
  background: #0e1318;
  display: flex;
  flex-direction: column;
  .tab-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #aaacad;
    padding: 10px 0;
    height: 56px;
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
      font-size: 12px;
      font-weight: bold;
      display: block;
    }
    img {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
