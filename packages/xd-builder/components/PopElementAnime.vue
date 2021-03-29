<template>
  <el-dialog 
    id="pop-element-anime"
    title="动画设置"
    modal 
    :close-on-click-modal="false"
    :visible="visible"
    width="720px"
    @close="$emit('update:visible', false)" 
    @opened="setEditorValue" 
    @closed="closeEditor"
  >
    <el-tabs v-if="scene" v-model="stage" @tab-click="tabChange">
      <el-tab-pane label="动画" name="enter" />
      <el-tab-pane v-for="stageInfo in scene.stages" :key="stageInfo.name" :name="stageInfo.name" :label="stageInfo.name" />
    </el-tabs>
    <div id="anime-editor" class="editor">
    </div>
    <el-tag v-for="(tpl, key) in TPLS" :key="key" @click="addTemplate(key)">{{ key }}</el-tag>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button type="primary" @click="confirmAnime">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import ace from 'brace'
import 'brace/mode/json'
import 'brace/theme/eclipse'

const TPLS = {
  'translateX': {
    'translateX': 100
  },
  'translateY': {
    'translateY': 100
  },
  'translateZ': {
    'translateZ': 100
  },
  'rotate': {
    'rotate': 100
  },
  'duration': {
    duration: 1000
  },
  'scale': {
    'scale': 1.2
  },
  'skew': {
    'skew': 100
  },
  'rotate': {
    'rotate': 100
  },
  'delay': {
    'delay': 1000
  },
  'direction': {
    direction: 'alternate'
  },
  'linear': {
    easing: 'linear'
  },
  'easeInQuad': {
    easing: 'easeInQuad'
  },
  'easeOutQuad': {
    easing: 'easeOutQuad'
  },
  'easeInOutQuad': {
    easing: 'easeInOutQuad'
  },
  'easeOutInQuad': {
    easing: 'easeOutInQuad'
  },
}

export default {
  name: "PopElementAnime",
  props: {
    visible: {
      type: Boolean
    },
    scene: {
      type: Object
    },
    elements: {
      type: Array
    }
  },

  data () {
    return {
      TPLS,
      stage: 'enter'
    }
  },

  watch: {
    stage (current, prev) {
      this.switchStage(current, prev)
    }
  },

  mounted () {

  },

  methods: {
    tabChange (tab) {
    },
    addTemplate (tpl) {
      const parsed = JSON.parse(this.getEditor().getValue())
      Object.assign(parsed, TPLS[tpl])
      this.getEditor().setValue(JSON.stringify(parsed, null, 2))
    },
    setEditorValue () {
      this.stage = 'enter'
      this.getEditor().setValue(JSON.stringify(this.elements[0].animation[this.stage], null, 2))
    },

    getEditor () {
      if (!this.editor) {
        this.editor = ace.edit('anime-editor')
        this.editor.getSession().setMode('ace/mode/json')
        this.editor.getSession().setTabSize(2);
        this.editor.getSession().setUseWrapMode(true);
        this.editor.setTheme('ace/theme/eclipse');
      }
      return this.editor
    },

    switchStage(current, prev) {
      try {
        this.elements[0].animation[prev] = JSON.parse(this.getEditor().getValue())
      } catch (e) { }
      this.getEditor().setValue(JSON.stringify(this.elements[0].animation[current], null, 2))
    },

    closeEditor () {
       try {
        this.elements[0].animation[this.stage] = JSON.parse(this.getEditor().getValue())
      } catch (e) { }
    },

    confirmAnime () {
      this.elements[0].animation[this.stage] = JSON.parse(this.getEditor().getValue())
      if (this.elements.length > 1) {
        for (let i = 1; i < this.elements.length; i++) {
          this.elements[i].animation = JSON.parse(JSON.stringify(this.elements[0].animation))
        }
      }
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss">
#pop-element-anime {
  .editor {
    height: 360px;
    border: 1px solid #eee;
  }
}

</style>