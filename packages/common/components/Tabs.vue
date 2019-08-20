<template>
<div class="tabs" :class="size">
  <ul>
    <li v-for="tab in tabs" :key="tab.key" :class="currentNav === tab.key? 'is-active': ''">
      <a @click="chooseNav(tab.key)">
        <span v-if="tab.icon" class="icon"><i :class="tab.icon" aria-hidden="true"></i></span>
        <span v-if="tab.title">{{tab.title}}</span>
      </a>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    size: {
      type: String,
      default: 'is-medium'
    },
    tabs: {
      type: Array
    },
    value: {
      type: String
    }
  },
  data () {
    return {
    }
  },
  computed: {
    currentNav () {
      return this.value
    }
  },
  methods: {
    chooseNav (key) {
      this.$emit('input', key)
    }
  }
}
</script>

<style scoped>

</style>
