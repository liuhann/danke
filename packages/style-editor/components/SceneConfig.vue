<template>
  <div class="scene-config box">
    <div class="tabs">
      <ul>
        <li v-for="tab in tabsName" :key="tab" :class="currentTab===tab? 'is-active': ''"><a @click="setTab(tab)">{{tab}}</a></li>
      </ul>
    </div>
     <div class="tabContent">
      <div class="basic panel" v-show="currentTab === '背景'">
        <edit-background></edit-background>
      </div>
      <div class="position-config" v-show="currentTab==='位置'">
      </div>
    </div>
  </div>
</template>

<script>
import EditBackground from './EditBackground.vue'
export default {
  name: 'SceneConfig',
  components: { EditBackground
  },
  props: {
    trigger: {
      type: String
    },
    elements: {
      type: Array
    }
  },
  data () {
    return {
      currentTab: '背景',
      tabsName: ['背景', '所有元素']
    }
  },
  filters: {
    
  },
  watch: {
   
  },
  created () {
  },

  methods: {
    setTab(tab) {
      this.currentTab = tab
    }
  }
}
</script>

<style lang="scss">
.scene-config {
  
}
</style>
