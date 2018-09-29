<template>
  <div class="scene-center-focus-text">
    <div ref="animation"
      class="text-content">
      <type-line :content="data.value"></type-line>
    </div>
  </div>
</template>

<script>
import merge from 'merge'
import TypeLine from './TypeLine.vue'

const defaultData = {
  in: {
    name: 'ZoomIn',
    from: 3,
    to: 1,
    dura: 300
  },
  standing: {
    dura: 2000
  },
  out: {
    name: 'ZoomIn',
    from: 1,
    to: 0.5,
    dura: 100
  }
}

export default {
  name: 'CenterFocusText',
  components: {
    TypeLine
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },

  data () {
    return {
      config: merge.recursive(true, defaultData, this.data)
    }
  },

  computed: {
    nextId () {
      if (this.config.next) {
        return this.config.next.id
      } else {
        return ''
      }
    }
  },

  created () {
  },

  mounted () {

  },

  methods: {
    play () {

    },

    async in () {
      if (this.config.in) {
        await this.motion(this.$refs.animation, this.config.in.name, this.config.in)
      }
      await this.ready()
    },

    async ready () {
      if (this.config.standing.dura) {
        setTimeout(async () => {
          await this.out()
        }, this.config.standing.dura)
      }
    },

    async out () {
      this.$emit('beginOut', this.nextId)
      if (this.config.out) {
        await this.motion(this.$refs.animation, this.config.out.name, this.config.out)
      }
      this.$emit('outComplete', this.nextId)
    }
  }
}
</script>

<style lang="less">
.scene-center-focus-text {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
