<template>
  <el-dialog id="pop-element-anime" title="动画设置" modal :close-on-click-modal="false" :visible="visible" width="720px" @close="$emit('update:visible', false)" @opened="setEditorValue">
    <el-tabs v-model="stage">
      <el-tab-pane label="初始状态" name="default">
        <div id="anime-begin-editor" class="editor">
        </div>
      </el-tab-pane>
      <el-tab-pane label="动画" name="enter">
        <div id="anime-enter-editor" class="editor">
        </div>
      </el-tab-pane>
      <el-tab-pane label="离场动画" name="exit">
        <div id="anime-exit-editor" class="editor">
        </div>
      </el-tab-pane>
    </el-tabs>
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

  mounted () {

  },

  methods: {
    addTemplate (tpl) {
      const editor = this[this.stage + 'Editor']
      const parsed = JSON.parse(editor.getValue())
      Object.assign(parsed, TPLS[tpl])
      editor.setValue(JSON.stringify(parsed, null, 2))
    },
    setEditorValue () {
      if (!this.enterEditor) {
        this.enterEditor = ace.edit('anime-enter-editor')
        this.enterEditor.getSession().setMode('ace/mode/json')
        this.enterEditor.getSession().setTabSize(2);
        this.enterEditor.getSession().setUseWrapMode(true);
        this.enterEditor.setTheme('ace/theme/eclipse')
      }
      if (!this.exitEditor) {
        this.exitEditor = ace.edit('anime-exit-editor')
        this.exitEditor.getSession().setMode('ace/mode/json')
        this.exitEditor.getSession().setTabSize(2);
        this.exitEditor.getSession().setUseWrapMode(true);
        this.exitEditor.setTheme('ace/theme/eclipse')
      }

      if (!this.beginEditor) {
        this.beginEditor = ace.edit('anime-begin-editor')
        this.beginEditor.getSession().setMode('ace/mode/json')
        this.beginEditor.getSession().setTabSize(2);
        this.beginEditor.getSession().setUseWrapMode(true);
        this.beginEditor.setTheme('ace/theme/eclipse')
      }

      this.stage = 'enter'
      this.enterEditor.setValue(JSON.stringify(this.elements[0].animation.enter, null, 2))
      this.exitEditor.setValue(JSON.stringify(this.elements[0].animation.exit, null, 2))
      this.beginEditor.setValue(JSON.stringify(this.elements[0].style, null, 2))
    },

    confirmAnime () {
      const enter = this.enterEditor.getValue()
      const exit = this.exitEditor.getValue()
      const begin = this.beginEditor.getValue()
      this.elements.forEach( el => {
        el.animation.enter = JSON.parse(enter)
        el.animation.exit = JSON.parse(exit)
        el.style = JSON.parse(begin)
      })
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