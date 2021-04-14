<template>
  <el-dialog 
    id="pop-element-style"
    title="样式配置"
    modal 
    :close-on-click-modal="false"
    :visible="visible"
    width="720px"
    @close="$emit('update:visible', false)" 
    @opened="setEditorValue" 
    @closed="closeEditor"
  >
    <div id="style-editor" class="editor">
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import ace from 'brace'
import 'brace/mode/json'
import 'brace/theme/eclipse'


export default {
  name: "PopElementStyle",
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
    return {}
  },

  watch: {
  },

  mounted () {

  },

  methods: {
    setEditorValue () {
      this.getEditor().setValue(JSON.stringify(this.elements[0].style, null, 2))
    },

    getEditor () {
      if (!this.editor) {
        this.editor = ace.edit('style-editor')
        this.editor.getSession().setMode('ace/mode/json')
        this.editor.getSession().setTabSize(2);
        this.editor.getSession().setUseWrapMode(true);
        this.editor.setTheme('ace/theme/eclipse');
      }
      return this.editor
    },

    closeEditor () {
       try {
         this.editor.setValue('')
      } catch (e) { }
    },

    confirm () {
      for (const element of this.elements) {
        element.style = JSON.parse(this.getEditor().getValue())
      }
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss">
#pop-element-style {
  .editor {
    height: 360px;
    border: 1px solid #eee;
  }
}

</style>