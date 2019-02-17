<template>
<div class="home">
  <header>
    <logo-wrapper></logo-wrapper>
    <div class="empty"></div>
    <van-icon name="manager" class="icon-head"></van-icon>
    <van-icon name="plus" class="icon-add" @click="pop.screenType = true"></van-icon>
  </header>
  <div class=""></div>

  <a href="#/designer">Designer</a>
  <ul>
    <li v-for="work in works">
      <router-link :to="'/designer/' + work.id">{{work.id}} - {{work.scenes}}</router-link>
    </li>
  </ul>

  <van-popup v-model="pop.screenType" class="choose-screen-type">
    <tab-choose-type @choose="choose"></tab-choose-type>
  </van-popup>
</div>
</template>

<script>
import LogoWrapper from '../common/LogoWrapper'
import TabChooseType from './TabChooseType'
export default {
  name: 'Home',
  components: {TabChooseType, LogoWrapper},
  data () {
    return {
      pop: {
        screenType: false
      },
      elementCollapseName: 0,
      works: []
    }
  },
  created () {
    this.listWork()
  },
  methods: {
    choose (type) {
      this.$router.replace('/designer/' + type)
    },
    async listWork () {
      const result = await this.ctx.workdao.listMine()
      this.works = result.list
    }
  }
}
</script>

<style lang="less">
@height: 56px;
@padding: 10px;
.home {
  header {
    display: flex;
    height: @height;
    line-height: @height;
    background: #0B2239;
    color: #fff;
    .empty {
      flex: 1;
    }
    .icon-head {
      margin: 10px;
      background: #c3c3c3;
      width: 36px;
      font-size: 24px;
      border-radius: 24px;
      text-align: center;
      line-height: 36px;
    }
    .icon-add {
      padding: 10px;
      font-size: 24px;
      line-height: 36px;
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

  .choose-screen-type {
    width: 80%;
    .van-cell {
      svg {
        margin-left: -10px;
      }
    }
  }
}
</style>
