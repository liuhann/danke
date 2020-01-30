<template>
<div id="hero" class="hero">
  <logo-wrapper></logo-wrapper>
  <h1 class="text-inverted swing-in-bottom-fwd">
    轻松制作适用于各种设备的展示内容，用图片、页面的形式分享
  </h1>
</div>
</template>

<script>
import anime from 'animejs'
import LogoWrapper from './LogoWrapper'

export default {
  name: 'Hero',
  components: { LogoWrapper },
  created () {

  },

  mounted () {
    var tl = anime.timeline({
      easing: 'easeOutExpo',
      duration: 750
    }).add({
      targets: '#hero path',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: function (el, i) { return (2 - i) * 500 },
      delay: function (el, i) { return i * 1000 }
    }).add({
      targets: 'svg',
      scale: 0.6,
      easing: 'easeInOutSine',
      duration: 600
    })
  }
}
</script>

<style lang="scss">
  #hero {
    background-attachment: fixed;
    background-image: url('pattern.png');
    background-color: #0B2239;
    padding: 46px 24px 24px;
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
        margin-left: -22px;
        margin-right: -22px;
      }
    }
    .text-inverted {
      font-size: 1em;
      font-weight: normal;
      text-align: center;
      width: 80%;
      color: #fff;
      margin: 0 auto;
    }
  }

  .tracking-in-expand{animation:tracking-in-expand .7s cubic-bezier(.215,.61,.355,1.000) 2s both}
  .swing-in-bottom-fwd{animation:swing-in-bottom-fwd .5s cubic-bezier(.19,1.000,.22,1.000) 2s both}
  @keyframes tracking-in-expand{0%{letter-spacing:-.5em;opacity:0}40%{opacity:.6}100%{opacity:1}}
  @keyframes swing-in-bottom-fwd{0%{transform:rotateX(100deg);transform-origin:bottom;opacity:0}100%{transform:rotateX(0);transform-origin:bottom;opacity:1}}
</style>
