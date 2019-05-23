<template>
<div class="page-page-list">
  <nav-bar></nav-bar>
  <div class="section">
    <drop-down-menu :menus="createMenus" @menu-clicked="menuClicked">
      <span class="button icon-plus">增加</span>
    </drop-down-menu>
    <div class="columns is-multiline is-mobile is-tablet">

    </div>
  </div>
</div>
</template>

<script>
import './fontello/css/fontello.css'
import NavBar from '../common/site/NavBar'
import ratios from './utils/ratios'
import DropDownMenu from '../common/components/DropDownMenu'
import RestDAO from '../common/dao/restdao'
export default {
  name: 'PageList',
  components: {DropDownMenu, NavBar },
  data () {
    return {
      createMenus: ratios
    }
  },

  created () {
    this.scenedao = new RestDAO(this.ctx, 'scenes')
  },

  mounted () {
    
  },

  methods: {
    async loadMoreScenes () {
      const result = await this.scenedao.list({
        
      })
    },
    menuClicked (menu) {
      this.$router.push('/page-tool/new/' + menu.ratio)
    }
  }
}
</script>

<style>

</style>
