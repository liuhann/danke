<template>
<div id="hero" class="hero">
  <div class="logo-wrapper">
    <div class="sf tracking-in-expand" style="margin-right: -20px;">Dan</div>
    <svg id="svg_k"  viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <g>
        <title>Layer 1</title>
        <g>
          <path stroke="#69E781" id="svg_2" d="m82.69395,65.97973c-2.81745,0 -5.09486,2.2137 -5.09486,4.94128l0,106.25706c0,2.72758 2.27741,4.94128 5.09486,4.94128c2.81748,0 5.09489,-2.2137 5.09489,-4.94128l0,-43.61164l69.83549,47.65361c0.89159,0.60777 1.91057,0.89932 2.92446,0.89932c1.59977,0 3.17918,-0.73131 4.16758,-2.10005c1.62021,-2.23346 1.06995,-5.31185 -1.23294,-6.88319l-71.92951,-49.08656l63.91015,-43.61167l0,63.11484c0,2.72761 2.27741,4.94128 5.09489,4.94128c2.81745,0 5.09486,-2.2137 5.09486,-4.94128l0,-72.63172c0,-1.84804 -1.05973,-3.533 -2.74612,-4.38786c-1.6966,-0.84989 -3.71926,-0.71152 -5.27831,0.3459l-69.83549,47.65361l0,-43.61164c-0.00508,-2.72758 -2.28249,-4.94128 -5.09997,-4.94128l0,0l0,0l0.00002,-0.00002l0,0.00001z" fill="transparent" stroke-width="8"/>
          <path stroke="#FFF" stroke-width="3" id="svg_3" d="m122.21183,17.82731c-17.6331,0 -35.09063,4.43651 -50.4783,12.83282c-2.02802,1.10808 -2.77647,3.64624 -1.6684,5.67423c1.10808,2.02799 3.65457,2.77648 5.67002,1.66839c14.1667,-7.7273 30.24018,-11.81257 46.47668,-11.81257c53.60607,0 97.21844,43.6124 97.21844,97.21844s-43.61241,97.21844 -97.21844,97.21844c-53.60604,0 -97.21844,-43.6124 -97.21844,-97.21844c0,-26.18 10.26546,-50.73759 28.91048,-69.1568c1.64331,-1.6224 1.66003,-4.26927 0.03345,-5.91257c-1.62241,-1.64749 -4.26505,-1.66003 -5.91254,-0.03763c-20.24651,20.00402 -31.39425,46.6774 -31.39425,75.107c0,58.21818 47.36317,105.58131 105.58132,105.58131c58.21818,0 105.58134,-47.36313 105.58134,-105.58131c0,-58.21818 -47.36317,-105.58131 -105.58134,-105.58131l0,0l-0.00001,0l-0.00001,0z" fill="transparent"/>
        </g>
      </g>
    </svg>
    <div class="sf tracking-in-expand" style="margin-left: -20px;">e</div>
  </div>
  <h1 class="text-inverted swing-in-bottom-fwd">
    轻松制作适用于各种设备的展示内容，用图片、页面的形式分享
  </h1>
</div>
</template>

<script>
import anime from 'animejs'

export default {
  name: 'Hero',
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
      duration: function(el, i) { return (2-i) * 500 },
      delay: function(el, i) { return i * 1000 },
    }).add({
      targets: '#svg_k',
      scale: 0.6,
      easing: 'easeInOutSine',
      duration: 600
    })
    /*anime({
      targets: '.sf',
      opacity: 1,
      scale: 1,
      easing: 'linear',
      delay: 2000,
      duration: 600
    })*/
  }
}
</script>

<style lang="less">
  #hero {
    background-attachment: fixed;
    background-size: cover;
    background: #0B2239;
    padding: 46px 24px 24px;
  }

  .logo-wrapper {
    display: flex;
    justify-content: center;
    .sf {
      /*opacity: 0;*/
      /*transform: scale(.2);*/
      color: #fff;
      line-height: 120px;
      font-size: 40px;
    }
  }
  .tracking-in-expand{animation:tracking-in-expand .7s cubic-bezier(.215,.61,.355,1.000) 2s both}
  .swing-in-bottom-fwd{animation:swing-in-bottom-fwd .5s cubic-bezier(.19,1.000,.22,1.000) 2s both}
  @keyframes tracking-in-expand{0%{letter-spacing:-.5em;opacity:0}40%{opacity:.6}100%{opacity:1}}
  @keyframes swing-in-bottom-fwd{0%{transform:rotateX(100deg);transform-origin:bottom;opacity:0}100%{transform:rotateX(0);transform-origin:bottom;opacity:1}}
  #svg_k {
    width: 120px;
    height: 120px;
  }
  .text-inverted {
    font-size: 1em;
    font-weight: normal;
    text-align: center;
    width: 80%;
    color: #fff;
    margin: 0 auto;
  }
</style>
