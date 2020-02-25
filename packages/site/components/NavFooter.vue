<template>
<footer class="footer">
  <div class="container">
    <div class="columns">
      <div class="column is-4">
        <div class="bd-footer-tsp">
          Source code licensed <a href="https://opensource.org/licenses/mit-license.php">MIT</a>.
        </div>
        <div >
          网站备案号<a href="http://www.beian.miit.gov.cn"> 京ICP备14044474号-3</a> | 蛋壳分享
        </div>
        <div >
          © 2018-2020 DANKE.FUN
        </div>
      </div>
    </div>
  </div>
</footer>
</template>

<script>
export default {
  name: 'NavFooter'
}
</script>

<style lang="scss">
footer {
  padding: 4rem 2rem;
  align-items: stretch;
  justify-content: center;
  background: #fff;
  color: #777;
  line-height: 30px;
  display: flex;
  a {
    color: #333;
    text-decoration: none;
  }
}
</style>
