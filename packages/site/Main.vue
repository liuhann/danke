<template>
<div id="site">
  <section class="primary-background">
    <nav-bar></nav-bar>
    <section class="section has-text-centered hero is-medium">
      <div class="section">
        <p class="title is-3 is-spaced has-text-white is-family-sans-serif">
          设计适用于各种场景的展示页面
        </p>
        <p class="has-text-white" style="font-size: 20px;margin-bottom: 40px;">
          Customize keyboard shortcuts for your frequently visited websites
        </p>
        <router-link class="round-button installation chrome-installation" to="/xd/welcome">
          立刻开始
        </router-link>
      </div>
    </section>
  </section>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <p class="title is-3 is-spaced">
            微自适应
          </p>
          <p class="subtitle is-5">
          通过合理的自适应设计，可以让您的展示在各种设备与情境
          </p>
        </div>
        <div class="column">
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
        </div>
        <div class="column">
          <p class="title is-3 is-spaced">
            节奏与交互
          </p>
          <p class="subtitle is-5">
            多个场景，自由切换。变换触手可及
          </p>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <p class="title is-3 is-spaced">
            随意的动画效果
          </p>
          <p class="subtitle is-5">
            动画设计器，让变换随心所欲
          </p>
        </div>
        <div class="column">
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <p class="title is-3 is-spaced">
            移动设计
          </p>
          <p class="subtitle is-5">
            不需要使用电脑，用手机上也能进行创作
          </p>
        </div>
        <div class="column">
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
        </div>
        <div class="column">
          <p class="title is-3 is-spaced">
            自由分享
          </p>
          <p class="subtitle is-5">
            蛋壳云服务托管，或者导出到自己的站点
          </p>
        </div>
      </div>
    </div>
  </section>
  <section class="hero">
    <div class="hero-body">
      <div class="container is-centered">
        <a class="button is-success is-rounded is-medium">马上使用</a>
      </div>
    </div>
  </section>
  <nav-footer></nav-footer>
</div>
</template>
<script>
import NavBar from './components/NavBar'
import WorkList from './sections/WorkList'
import NavFooter from './components/NavFooter'
export default {
  name: 'view.vue',
  components: { NavFooter, WorkList, NavBar },
  created () {

  }
}
</script>

<style lang="scss">
#site {
  .primary-background {
    background-color: #507ce8;
    color: #fff;
    background-image: url('/res/icons-background.svg');
    .heading {
      font-size: 36px;
      line-height: 60px;
      font-family: Poppins,sans-serif;
      font-weight: 600;
      color: #234689;
      letter-spacing: 0;
    }
  }
  // background-image: linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12);
}
</style>
