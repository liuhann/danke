<template>
<div class="page-page-list">
  <nav-bar></nav-bar>
  <div class="section">
    <nav class="level">
      <div class="level-left">
        <span class="button icon-mobile" @click="goPageTool">创建页面</span>
      </div>
    </nav>
    <div class="columns is-multiline is-mobile is-tablet">
      <div class="column is-one-fifth-widescreen is-three-quarters-tablet is-half-mobile" v-for="animation in animations" :key="animation.name">
        <div class="card-image play-area" @click="replay(animation)" @mouseover="replay(animation)">
          <div class="preview-box" :class="animation.name"></div>
        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <p class="title is-6">{{animation.desc}}</p>
              <p class="subtitle is-7">{{animation.name}}</p>
            </div>
            <div class="media-right">
              <a class="icon-edit" v-if="!animation.userid || animation.userid === userid" @click="edit(animation)"></a>
              <a class="icon-heart-empty" @click="addToMine"></a>
              <a class="icon-trash-empty" v-if="!animation.userid || animation.userid === userid" @click="removeAnimation(animation._id)"></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import NavBar from '../common/site/NavBar'
export default {
  name: 'PageList',
  components: { NavBar },
  methods: {
    goPageTool () {

    }
  }
}
</script>

<style scoped>

</style>
