<template>
  <div class="scene-config box">
    <div class="tabs">
      <ul>
        <li v-for="tab in tabsName" :key="tab" :class="currentTab===tab? 'is-active': ''"><a @click="setTab(tab)">{{tab}}</a></li>
      </ul>
    </div>
     <div class="tabContent">
      <div class="basic panel" v-show="currentTab === '场景配置'">
        <form-field label="名称" v-model="scene.name">
        </form-field>
        <edit-background v-model="scene.background"></edit-background>
      </div>
      <div class="element-list panel" v-show="currentTab==='元素列表'">
         <a class="panel-block" v-for="element of elements" :key="element.id" @click="toggleElement(element)">
          <div v-if="element.type === TypeEnum.IMAGE" class="image" :style="'background-image: url(' + element.url + ')'"></div>
           <i :class="element.visible? 'icon-eye-1': 'icon-eye-outline'" @click="toggleElementVisible(element)"></i>
           <i :class="icon-trash" @click="deleteElement(element)"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import EditBackground from './EditBackground.vue'
import FormField from '../../common/components/FormField'
import { TypeEnum } from '../../danke-core/elements/index'

export default {
  name: 'SceneConfig',
  components: { FormField, EditBackground },
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
      TypeEnum,
      currentTab: '场景配置',
      tabsName: ['场景配置', '元素列表']
    }
  },
  filters: {

  },
  watch: {

  },
  created () {
  },

  methods: {

    toggleElementVisible (element) {
      debugger
      if (element.visible) {
        element.visible = false
      } else {
        element.visible = true
      }
    },
    deleteElement (element) {
      this.$emit('remove', element)
    },
    setTab(tab) {
      this.currentTab = tab
    },
    toggleElement (element) {
      // this.$emit('choose', element)
    }
  }
}
</script>

<style lang="scss">
.scene-config {
  .panel-block {
    padding: 5px;
    height: 31px;
    box-sizing: border-box;
  }
  .image {
    margin: 0 10px;
    width: 20px;
    height: 20px;
    background-size: cover;
  }
}
</style>
