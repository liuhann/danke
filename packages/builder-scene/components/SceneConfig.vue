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
          <div v-if="element.type === TypeEnum.SHAPE" class="shape" :style="{
            backgroundColor: element.background.colors[0]
          }"></div>
           <i :class="element.visible? 'icon-eye-1': 'icon-eye-outline'" @click="toggleElementVisible(element)"></i>
           <div class="element-content"></div>

           <i class="icon-trash" @click="deleteElement(element)"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import EditBackground from './EditBackground.vue'
import FormField from '../../common/components/FormField'
import { TypeEnum } from '../../danke-core/elements/index'
import { MessageBox } from 'element-ui'

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
      iconSet: {
        [TypeEnum.SHAPE]: 'icon-popup',
        [TypeEnum.TEXT]: 'icon-sort-alphabet'
      },
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
      console.log('set element visible', element.visible)
      this.$set(element, 'visible', !element.visible)
      // element.visible = !element.visible
    },
    deleteElement (element) {
      MessageBox.confirm('确认删除元素，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('remove', element)
      })
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
  .element-content {
    flex: 1;
  }
  .image {
    margin-right: 5px;
    width: 20px;
    height: 20px;
    background-size: cover;
  }
  .shape {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
}
</style>
