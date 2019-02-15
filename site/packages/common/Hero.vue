<template>
<div id="hero" class="hero">
  <div class="logo-wrapper">
    <svg width="240" height="80" xmlns="http://www.w3.org/2000/svg" id="capa">
      <g>
        <path id="svg_2" d="m157.329884,24.914692c-0.882784,0 -1.596355,0.693606 -1.596355,1.548226l0,33.293054c0,0.854621 0.713571,1.548226 1.596355,1.548226c0.882784,0 1.596355,-0.693606 1.596355,-1.548226l0,-13.664643l21.88124,14.931092c0.279362,0.190432 0.598633,0.281777 0.916308,0.281777c0.501255,0 0.996126,-0.229137 1.305818,-0.657996c0.507641,-0.699798 0.335234,-1.664343 -0.386318,-2.156679l-22.537342,-15.380078l20.024679,-13.664643l0,19.775492c0,0.854621 0.713571,1.548226 1.596355,1.548226c0.882784,0 1.596355,-0.693606 1.596355,-1.548226l0,-22.757376c0,-0.579037 -0.332042,-1.106981 -0.860436,-1.374825c-0.531586,-0.266295 -1.165339,-0.222945 -1.653824,0.108376l-21.88124,14.931092l0,-13.664643c-0.001596,-0.854621 -0.715167,-1.548226 -1.597952,-1.548226l0.000001,0.000001l0.000001,-0.000001z" fill="transparent" stroke-width="3" stroke="#69E781"/>
        <path stroke="#0c2239" id="svg_3" d="m169.711844,9.827309c-5.524908,0 -10.99479,1.390071 -15.816148,4.020855c-0.635423,0.34719 -0.869941,1.142452 -0.52275,1.777875c0.34719,0.635423 1.145072,0.869941 1.776565,0.52275c4.438793,-2.42116 9.475015,-3.701178 14.562333,-3.701178c16.796141,0 30.46102,13.664879 30.46102,30.46102s-13.664879,30.46102 -30.46102,30.46102c-16.796141,0 -30.46102,-13.664879 -30.46102,-30.46102c0,-8.202858 3.216422,-15.897377 9.058387,-21.668594c0.514889,-0.508339 0.52013,-1.337665 0.010481,-1.852554c-0.508339,-0.5162 -1.336354,-0.52013 -1.852554,-0.011791c-6.343753,6.267764 -9.836617,14.62522 -9.836617,23.532939c0,18.241238 14.840085,33.081322 33.081322,33.081322c18.241238,0 33.081322,-14.840085 33.081322,-33.081322c0,-18.241238 -14.840085,-33.081322 -33.081322,-33.081322l0.000001,0z" fill="transparent"/>
        <text fill="#0c2239" stroke="#000000" stroke-width="0" x="28" y="62.5" font-size="50" font-family="Arvo, sans-serif" text-anchor="start" xml:space="preserve" font-weight="bold">D</text>
      <text fill="#0c2239" stroke="#000000" stroke-width="0" x="68" y="62.5" font-size="50" font-family="Arvo, sans-serif" text-anchor="start" xml:space="preserve" font-weight="bold">a</text>
      <text fill="#0c2239" stroke="#000000" stroke-width="0" x="100" y="62.5" font-size="50" font-family="Arvo, sans-serif" text-anchor="start" xml:space="preserve" font-weight="bold">n</text>
      <text fill="#0c2239" stroke="#000000" stroke-width="0" x="208" y="62.5" id="svg_5" font-size="50" font-family="Arvo, sans-serif" text-anchor="start" xml:space="preserve" font-weight="bold">e</text>
      </g>
    </svg>
  </div>
  <h1 class="text-inverted">
    轻松制作适用于各种设备的展示内容，用图片、视频、页面的形式分享
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
      targets: '#capa text',
      opacity: 1,
      translateX: 0,
      direction: 'reverse',
      easing: 'easeInOutSine',
      duration: function(el, i) { return (i+1) * 350 },
      delay: function(el, i) { return i * 25 },
    })
  }
}
</script>

<style lang="less">
  #capa {
    width: 240px;
    height: 80px;
  }
  #capa text {
    opacity: 0;
    transform: translateX(20px);
  }

  #hero {
    background-attachment: fixed;
    background-size: cover;
    background: #0B2239;
    padding: 86px 24px 24px;
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
