<template>
<nav id="list-config">
  {{currentScene}}
  <p class="head" v-if="showSceneList">
    <span>画面列表</span>
    <i class="icon-plus-1" @click="addNewScene"></i>
  </p>
  <p class="head" v-if="!showSceneList">
    <i class="icon-angle-left" @click="returnSceneList"></i>
    <span>
      {{currentScene.name}}
    </span>
  </p>
  <div class="item-list">
    <div class="scene-list" v-if="showSceneList">
      <div class="scene-item list-item" v-for="(scene, index) of work.scenes" :class="[currentScene===scene?'current': '']" :key="index">
        <i class="icon-sticky-note-o"></i>
        <div class="list-content" @click="chooseScene(scene)">{{scene.name}}</div>
        <i class="icon-angle-right" @click="openScene(scene)"></i>
      </div>
    </div>
    <draggable v-model="elementList" v-if="!showSceneList">
      {{currentScene}}
      <div class="element-item list-item" v-for="(element, index) of currentScene.elements" :class="[currentElement===element?'current': '']" :key="index">
        <div v-if="element.type === TypeEnum.IMAGE" class="image" :style="'background-image: url(' + element.url + ')'"></div>
        <div v-if="element.type === TypeEnum.SHAPE" class="shape" :style="[{
            backgroundColor: element.background.colors[0] || '#ccc',
            border: '1px solid #999'
          }, element.shape === 'circle'? {
            borderRadius: '20px'
          }: {}]"></div>
        <div v-if="element.type === TypeEnum.TEXT" class="text">
          <i class="icon-sort-alphabet"></i>
        </div>
        <div class="name list-content" @click="chooseElement(element)">{{element.name}}</div>
        <!-- <div class="element-content animations">
          <div class="element-animation" v-if="element.animation.in" :style="[
              element.animation.in.name ? {
                clipPath: 'polygon(' + Math.floor(((element.animation.in.delay + element.animation.in.duration) * 100)/(maxInDuration * 5)) + '% 0%,'
                + ' 100% 0%,'
                + ' 100% 100%,'
                +  Math.floor(((element.animation.in.delay) * 100)/(maxInDuration * 3)) + '% 100%)'
            }: {}]"></div>
        </div> -->
        <i class="icon-clone" @click="cloneElement(element)"></i>
        <i :class="element.visible? 'icon-eye': 'icon-eye-off'" @click="toggleElementVisible(element)"></i>
        <i class="icon-trash-empty" @click="deleteElement(element)"></i>
      </div>
    </draggable>
  </div>
</nav>
</template>
<script>
import { TypeEnum } from '../../danke-core/elements'
import { MessageBox } from 'element-ui'
import { getMaxDuration } from '../../danke-core/css-model/animation'
import { clone } from '../../utils/object'
import { getLengthDelta } from '../../danke-core/utils/common'
import { getElementStyle } from '../../danke-core/utils/styles'
import draggable from 'vuedraggable'

export default {
  name: 'ListConfig',
  components: { draggable },
  props: {
  },
  inject: [
    'currentScene',
    'currentElement',
    'device',
    'work',
    'deleteElement',
    'chooseElement',
    'addNewScene',
    'cloneElement',
    'chooseScene'
  ],
  data () {
    return {
      showSceneList: false,
      elementList: this.currentScene.elements || [],
      TypeEnum,
      iconSet: {
        [TypeEnum.SHAPE]: 'icon-popup',
        [TypeEnum.TEXT]: 'icon-sort-alphabet'
      },
      selectedElements: []
    }
  },
  watch: {
    'currentScene': function () {
      this.elementList = this.currentScene.elements
    },
    'elementList': function () {
      this.$emit('ordered', this.elementList)
    }
  },
  computed: {
    hasSelected () {
      return this.selectedElements.length
    },
    maxInDuration () {
      return getMaxDuration(this.elements, 'in') || 1
    },
    maxOutDuration () {
      return getMaxDuration(this.elements, 'out') || 1
    }
  },
  filters: {
  },
  created () {
  },
  methods: {
    returnSceneList () {
      this.showSceneList = true
      this.chooseElement(null)
    },
    openScene (scene) {
      this.showSceneList = false
      this.chooseScene(scene)
    },
    toggleElementVisible (element) {
      this.$set(element, 'visible', !element.visible)
    },
    upAll () {
      for (let element of this.selectedElements) {
        let i = this.elements.indexOf(element)
        if (i > 0) {
          let c = this.elements[i - 1]
          this.$set(this.elements, i - 1, element)
          this.$set(this.elements, i, c)
        }
      }
    },

    downAll () {
      for (let element of this.selectedElements) {
        let i = this.elements.indexOf(element)
        if (i < this.elements.length - 1) {
          let c = this.elements[i + 1]
          this.$set(this.elements, i + 1, element)
          this.$set(this.elements, i, c)
        }
      }
    },

    topAll () {
      for (let i = 0; i < this.selectedElements.length; i++) {
        let element = this.selectedElements[i]
        let currentOrder = this.elements.indexOf(element)
        if (currentOrder > i) {
          let c = this.elements[i]
          this.$set(this.elements, i, element)
          this.$set(this.elements, currentOrder, c)
        }
      }
    },

    bottomAll () {
      for (let i = 0; i < this.selectedElements.length; i++) {
        let element = this.selectedElements[this.selectedElements.length - 1 - i]
        let currentOrder = this.elements.indexOf(element)
        let c = this.elements[this.elements.length - 1 - i]
        this.$set(this.elements, this.elements.length - 1 - i, element)
        this.$set(this.elements, currentOrder, c)
      }
    },

    deleteAll () {
      MessageBox.confirm('确认删除元素，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let element of this.selectedElements) {
          let currentOrder = this.elements.indexOf(element)
          this.elements.splice(currentOrder, 1)
        }
      })
    },
    copyAll () {
      for (let element of this.selectedElements) {
        const clonedElement = clone(element)
        clonedElement.visible = true
        clonedElement.position.offsetX = getLengthDelta(clonedElement.position.offsetX, 3)
        clonedElement.position.offsetY = getLengthDelta(clonedElement.position.offsetY, 3)
        clonedElement.style = getElementStyle(clonedElement, this.device)
        this.elements.push(clonedElement)
      }
    }
  }
}
</script>

<style lang="scss">
#list-config {
  position: absolute;
  left: 3.2em;
  width: 280px;
  bottom: 0;
  z-index: 1001;
  top: 2.5em;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .head {
    color: #999;
    font-weight: bold;
    margin: .5em;
    border-bottom: 1px solid #eee;
    display: flex;
    font-size: .9rem;
    line-height: 2rem;
    i {
      cursor: pointer;
      font-size: 1.2rem;
    }
    span {
      flex: 1;
    }
  }
  .return-scene {
    font-size: 1rem;
  }
  .list-item {
    display: flex;
    cursor: pointer;
    color: #666;
    padding: .3rem .5rem;
    font-size: .8rem;
    border-radius: 0;
    &.current {
      background: #f2f2f2;
    }
    &:hover {
       background: #f1f1f1;
    }
    .list-content {
      flex: 1;
    }
    i {
      padding: 0 .3rem;
    }
  }
  .image {
    margin-right: 5px;
    width: 16px;
    height: 16px;
    background-size: cover;
  }
  .shape {
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }
  .multiple-operations {
    display: flex;
    margin-top: .5rem;
  }
}
</style>
