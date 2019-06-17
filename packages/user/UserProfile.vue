<template>
<div id="user-profile">
  <nav-bar></nav-bar>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column user-profile is-one-quarter">
          <div class="card">
            <div class="card-image file">
              <figure class="file-label image is-square user-avatar">
                <img :src="user.avatar|| 'http://cdn.danke.fun/res/head.svg'" alt="">
                <input class="file-input" type="file">
              </figure>
            </div>
            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <p class="title is-4">John Smith</p>
                  <p class="subtitle is-6">账号: {{user.id}}</p>
                </div>
              </div>

              <div class="content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus nec iaculis mauris. <a>@bulmaio</a>.
                <a href="#">#css</a> <a href="#">#responsive</a>
                <br>
                <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
              </div>
            </div>
          </div>
        </div>
        <div class="column">
          bb
        </div>
      </div>
    </div>
  </section>
  <nav-footer></nav-footer>
</div>
</template>

<script>
import NavBar from '../site/components/NavBar'
import NavFooter from '../site/components/NavFooter'
export default {
  name: 'UserHome',
  components: { NavFooter, NavBar },
  data () {
    return {
      user: this.ctx.user
    }
  },
  created () {

  }
}
</script>

<style lang="scss">
#user-profile {
  figure.user-avatar {
    background-color: #eee;
  }
}
</style>
