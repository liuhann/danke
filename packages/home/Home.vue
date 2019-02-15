<template>
<div class="home">
  <header>
    <logo-wrapper></logo-wrapper>
  </header>
  <a href="#/designer">Designer</a>
  <ul>
    <li v-for="work in works">
      <router-link :to="'/designer/' + work.id">{{work.id}} - {{work.scenes}}</router-link>
    </li>
  </ul>
</div>
</template>

<script>
import LogoWrapper from '../common/LogoWrapper'
export default {
  name: 'Home',
  components: {LogoWrapper},
  data () {
    return {
      works: []
    }
  },
  created () {
    this.listWork()
  },
  methods: {
    async listWork () {
      const result = await this.ctx.workdao.listMine()
      this.works = result.list
    }
  }
}
</script>

<style lang="less">
@height: 56px;
@padding: 4px;
.home {
  header {
    display: flex;
    height: @height;
    line-height: @height;
    background: #0B2239;
    color: #fff;
  }
  .logo-wrapper {
    padding: @padding 10px;
    display: flex;
    justify-content: center;
    .sf {
      color: #fff;
      font-size: @height * 0.4;
      line-height: @height - 2 * @padding;
    }
    svg {
      width: @height - 2 * @padding;
      height: @height - 2 * @padding;
    }
  }
}
.logo-wrapper {
  display: flex;
  justify-content: center;
  .sf {
    color: #fff;
    line-height: 120px;
    font-size: 40px;
  }
  svg {
    width: 120px;
    height: 120px;
  }
}
</style>
