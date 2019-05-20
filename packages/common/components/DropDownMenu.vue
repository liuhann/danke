<template>
<div class="dropdown is-hoverable" :class="isRight? 'is-right': ''">
  <div class="dropdown-trigger">
    <slot></slot>
  </div>
  <div class="dropdown-menu" role="menu">
    <div class="dropdown-content">
      <template v-for="(menu, index) in menus">
        <a class="file dropdown-item" v-if="menu.type==='file'">
          <label class="file-label">
            <input class="file-input" type="file" name="resume" @input="fileChoosed(menu, $event)">
            <span :class="menu.icon">
              {{menu.label}}
            </span>
          </label>
        </a>
        <a v-else class="dropdown-item" :key="index" @click="menuClicked(menu)"><i :class="menu.icon"></i>{{menu.label}}</a>
      </template>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'DropDownMenu',
  props: {
    isRight: {
      type: Boolean,
      default: false
    },
    menus: {
      type: Array
    }
  },
  methods: {
    menuClicked (menu) {
      this.$emit('menu-clicked', menu)
    },
    fileChoosed (menu, e) {
      this.$emit('menu-clicked', menu, e)
    }
  }
}
</script>

<style>

</style>
