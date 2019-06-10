<template>
<div class="scene-config box">
   <div class="tabContent">
    <form-field label="名称" v-model="scene.name">
    </form-field>
    <div class="element-list panel">
       <a class="panel-block element-item" v-for="(element, index) of elements" :key="index" @click="toggleElement(element)">
        <i :class="element.checked?'icon-check': 'icon-check-empty'" @click="toggleSelect(element)"></i>
        <div v-if="element.type === TypeEnum.IMAGE" class="image" :style="'background-image: url(' + element.url + ')'"></div>
        <div v-if="element.type === TypeEnum.SHAPE" class="shape" :style="{
          backgroundColor: element.background.colors[0]
        }"></div>
        <div class="element-content animations">
         <div class="element-animation" v-if="element.animation.in" :style="{
            clipPath: 'polygon(' + Math.floor(((element.animation.in.delay + element.animation.in.duration) * 100)/(maxInDuration * 5)) + '% 0%,'
            + ' 100% 0%,'
            + ' 100% 100%,'
            +  Math.floor(((element.animation.in.delay) * 100)/(maxInDuration * 3)) + '% 100%)'
         }"></div>
        </div>
        <i :class="element.visible? 'icon-eye': 'icon-eye-off'" @click="toggleElementVisible(element)"></i>
        <i class="icon-trash" @click="deleteElement(element)"></i>
      </a>
    </div>
  </div>
</div>
</template>

<script>
import EditBackground from '../components/EditBackground.vue'
import FormField from '../../common/components/FormField'
import { TypeEnum } from '../../danke-core/elements'
import { MessageBox } from 'element-ui'
import { getMaxDuration } from '../../danke-core/css-model/animation'

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
  computed: {
    maxInDuration () {
      return getMaxDuration(this.elements, 'in') || 1
    },
    maxOutDuration () {
      return getMaxDuration(this.elements, 'out') || 1
    }
  },
  filters: {

  },
  watch: {

  },
  created () {
  },

  methods: {
    toggleSelect (element) {
      this.$set(element, 'checked', !element.checked)
    },
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

    elementUp (index) {
      if (index > 0) {
        let sw = this.elements[index - 1]
        this.elements[index - 1] = this.elements[index]
        this.elements[index] = sw
      }
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
    height: 100%;
    margin: 0 5px;
    flex: 1;
    .element-animation {
      background-color: #9ec8ee;
      height: 100%;
    }
  }
  .element-item {
    color: #888;
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
