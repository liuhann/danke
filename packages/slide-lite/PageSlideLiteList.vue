<template>
<div class="page-slide-lite-list section">
  <a class="button is-medium is-primary" @click="newSlide" style="margin-bottom: 2rem">新增</a>
  <div class="columns is-mobile is-multiline" >
    <div v-for="work in workList" :key="work.id" class="column is-half-mobile">
      <div class="device-container">
        <work-cover :work="work" :enable-mask="false" :ratio="'9:16'" :height="0"></work-cover>
        <div class="btns is-justify-center">
          <a class="button is-small is-info">编辑</a>
          <a class="button is-small is-danger">删除</a>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import RestDAO from '../common/dao/restdao'
import WorkCover from '../xd-builder/components/WorkCover'

export default {
  name: 'PageSlideLiteList',
  components: { WorkCover },
  data () {
    return {
      device: {
        width: 100,
        height: 100
      },
      workList: []
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },
  mounted () {
    this.loadTokenList()
  },
  methods: {
    async loadTokenList () {
      const result = await this.workdao.list({
        token: this.ctx.token
      })
      this.workList = result.list
    },
    newSlide () {
      this.$router.push('/slide/lite')
    }
  }
}
</script>

<style lang="scss">
.page-slide-lite-list {
  height: 100%;
  background: url('./bg.png');
  overflow: auto;
  .device-container {
    background-clip: content-box;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: inset 0px 0px 8px -5px rgba(163,163,163,0.67);
    position: relative;
    .btns {
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: rgba(255,255,255, .6);
      border-top: 1px solid #eee;
      padding: 10px 0;
      width: 100%;
      z-index: 9999;
      .button {
        margin-left: 5px;
      }
    }
  }
}
</style>
