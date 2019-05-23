<template>
  <div class="scene-config box">
    <div class="tabs">
      <ul>
        <li v-for="tab in tabsName" :key="tab" :class="currentTab===tab? 'is-active': ''"><a @click="setTab(tab)">{{tab}}</a></li>
      </ul>
    </div>
     <div class="tabContent">
      <div class="basic panel" v-show="currentTab === '场景配置'">
        <form-field label="名称" v-mode="scene.name">
        </form-field>
        <edit-background v-model="scene.background"></edit-background>
      </div>
      <div class="element-list panel" v-show="currentTab==='元素列表'">
         <a class="panel-block" v-for="element of elements" :key="element.id" @click="toggleElement(element)">
          <span class="panel-icon">
            <figure class="image is-16x16">
              <img :src="element.url">
            </figure>
          </span>
          {{element.name}}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import EditBackground from './EditBackground.vue'
export default {
  name: 'SceneConfig',
  components: { EditBackground },
  props: {
    trigger: {
      type: String
    },
    elements: {
      type: Array
    },
    scene: {
      type: Object
    },
  },
  data () {
    return {
      currentTab: '页面配置',
      tabsName: ['页面配置', '元素列表']
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
    },
    toggleElement (element) {
      this.$emit('choose', element)
    }
  }
}
</script>

<style lang="scss">
.scene-config {

}
</style>
