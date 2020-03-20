<template>
<div id="site">
  <nav-bar></nav-bar>
  <section class="section primary-background">
    <div class="container">
      <p class="intro-title">
        快速设计各种精美的动态展示
      </p>
      <p class="has-text-white">
        一键分享 带动全场
      </p>
      <router-link class="button is-large is-rounded installation chrome-installation" to="/creative/my">
        立刻开始
      </router-link>
    </div>
  </section>
  <section class="section intro">
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
          <img src="https://about.canva.com/wp-content/uploads/sites/3/2019/09/canva-white-and-black-business-plan-presentation-MADWz9UUqCk.png">
        </div>
      </div>
    </div>
  </section>
  <section class="section intro">
    <div class="container">
      <div class="columns">
        <div class="column">
          <img src="https://about.canva.com/wp-content/uploads/sites/3/2019/09/canva-white-and-black-business-plan-presentation-MADWz9UUqCk.png">
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
  <section class="section intro">
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
          <img src="https://about.canva.com/wp-content/uploads/sites/3/2019/09/canva-white-and-black-business-plan-presentation-MADWz9UUqCk.png">
        </div>
      </div>
    </div>
  </section>
  <section class="section intro">
    <div class="container">
      <div class="columns">
        <div class="column">
          <img src="https://about.canva.com/wp-content/uploads/sites/3/2019/09/canva-white-and-black-business-plan-presentation-MADWz9UUqCk.png">
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
</div>
</template>
<script>
import NavBar from './components/NavBar'
export default {
  name: 'view.vue',
  components: { NavBar },
  created () {

  }
}
</script>

<style lang="scss" scoped>
#site {
  color: #fff;
  font-size: 16px;
  background: linear-gradient(180deg, #0C003C 0%, #BFFFAF 100%), linear-gradient(165deg, #480045 25%, #E9EAAF 100%), linear-gradient(145deg, #480045 25%, #E9EAAF 100%), linear-gradient(300deg, rgba(233, 223, 255, 0) 0%, #AF89FF 100%), linear-gradient(90deg, #45EBA5 0%, #45EBA5 30%, #21ABA5 30%, #21ABA5 60%, #1D566E 60%, #1D566E 70%, #163A5F 70%, #163A5F 100%);
  background-blend-mode: overlay, overlay, overlay, multiply, normal;
  .primary-background {
    color: #fff;
    height: 48rem;
    text-align: center;
    .intro-title {
      margin-top: 18rem;
      position: relative;
      font-size: 3.2rem;
      line-height: 2rem;
      color: #fff;
      margin-bottom: 0;
      text-shadow: 0 2px 4px rgba(13,0,77,.08), 0 3px 6px rgba(13,0,77,.08), 0 8px 16px rgba(13,0,77,.08);
    }
    .has-text-white {
      font-size: 2rem;
      margin-bottom: 5rem;
    }
    a.installation {
      background-color: #fff;
      color: #0d004d;
      box-shadow: 0 2px 4px rgba(13,0,77,.08), 0 8px 16px rgba(13,0,77,.08), 0 32px 80px rgba(13,0,77,.08);
      line-height: 28px;
      border-radius: 4px;
      border: none;
      text-decoration: none;
      font-size: 20px;
      padding: 16px 40px;
      cursor: pointer;
    }
    .heading {
      font-size: 36px;
      line-height: 60px;
      font-family: Poppins,sans-serif;
      font-weight: 600;
      color: #234689;
      letter-spacing: 0;
    }
  }
  section.intro {
    margin: 20px 0;
    .columns {
      display: flex;
      .column {
        flex: 1;
        img {
          width: 90%;
        }
      }
    }
    .title {
      margin-top: 80px;
      font-size: 36px;
    }
  }
  // background-image: linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12);
}
</style>
