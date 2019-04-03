<template>
	<nav class="navbar" role="navigation" aria-label="main navigation">
		<div class="navbar-brand">
			<a class="navbar-item" href="https://bulma.io">
				<!--<img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">-->
			</a>
			<a role="button" class="navbar-burger burger" :class="burgerOpen" @click="toggleOpen" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
			</a>
		</div>

		<div id="navbarBasicExample" class="navbar-menu" :class="burgerOpen">
			<div class="navbar-start">
        <router-link to="/" class="navbar-item">首页</router-link>
				<a class="navbar-item">
					桌面
				</a>
				<div class="navbar-item has-dropdown is-hoverable">
					<a class="navbar-link">
						模板
					</a>
					<div class="navbar-dropdown">
						<a class="navbar-item">
							PPT
						</a>
						<a class="navbar-item">
							Jobs
						</a>
						<a class="navbar-item">
							Contact
						</a>
						<hr class="navbar-divider">
						<a class="navbar-item">
							Report an issue
						</a>
					</div>
				</div>
			</div>

			<div class="navbar-end">
				<div class="navbar-item">
					<div class="buttons">
						<a class="button is-primary" @click="getStarted">
							<strong>开始使用</strong>
						</a>
						<a class="button is-light">
							注册
						</a>
					</div>
				</div>
			</div>
		</div>
	</nav>
</template>

<script>
export default {
	name: 'NavBar',
	data () {
	  return {
	    isMobileOpened : false
		}
	},
  computed: {
    burgerOpen () {
      return  this.isMobileOpened? 'is-active': ''
    }
  },

  mounted () {
    this.$router.beforeEach((to, from, next) => {
      this.isMobileOpened = false
      next()
    })
  },

	methods: {
    toggleOpen () {
      this.isMobileOpened = !this.isMobileOpened
		},
    getStarted () {
      this.$router.push('/designer/full')
    }
	}
}
</script>

<style>

</style>
