<template>
  <el-dialog id="pop-element-anime" title="动画设置" :visible="visible" width="720px" @close="$emit('update:visible', false)" @opened="setEditorValue">
    <el-tabs v-model="stage">
      <el-tab-pane label="动画" name="enter">
        <div id="anime-enter-editor" class="editor">
        </div>
      </el-tab-pane>
      <el-tab-pane label="离场动画" name="exit">
        <div id="anime-exit-editor" class="editor">
        </div>
      </el-tab-pane>
    </el-tabs>

    <span slot="footer" class="dialog-footer">
      <el-button @click="drawer.animation = false">取 消</el-button>
      <el-button type="primary" @click="confirmAnime">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import ace from 'brace'
import 'brace/mode/json'
import 'brace/theme/eclipse'

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
      stage: 'enter'
    }
  },

  mounted () {

  },

  methods: {
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
      this.stage = 'enter'
      this.enterEditor.setValue(JSON.stringify(this.elements[0].animation.enter, null, 2))
      this.exitEditor.setValue(JSON.stringify(this.elements[0].animation.exit, null, 2))
    },

    confirmAnime () {
      const enter = this.enterEditor.getValue()
      const exit = this.exitEditor.getValue()
      this.elements.forEach( el => {
        el.animation.enter = JSON.parse(enter)
        el.animation.exit = JSON.parse(exit)
      })
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss">
#pop-element-anime {
  .editor {
    height: 480px;
    border: 1px solid #eee;
  }
}

</style>