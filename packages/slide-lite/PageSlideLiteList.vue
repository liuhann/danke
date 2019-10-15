<template>
<div class="page-slide-lite-list section">
  <a class="button is-small is-primary" @click="newSlide" style="margin-bottom: 1rem">新增</a>
  <div class="columns is-mobile is-multiline" >
    <div v-for="work in workList" :key="work.id" class="column is-half-mobile">
      <div class="device-container">
        <work-cover :work="work" :enable-mask="false" :ratio="'9:16'" :height="0"></work-cover>
        <div class="btns is-justify-center">
          <a class="button is-small is-info" @click="editSlide(work)">编辑</a>
          <a class="button is-small is-danger" @click="removeSlide(work)">删除</a>
        </div>
      </div>
    </div>
  </div>
  <div class="empty" v-if="workList.length === 0" style="color: #fff; font-size: 24px;font-weight: bold;text-align: center;margin-top: 40vh;">
    作品列表为空
  </div>
</div>
</template>

<script>
import RestDAO from '../common/dao/restdao'
import WorkCover from '../xd-builder/components/WorkCover'
import { MessageBox, Loading } from 'element-ui'

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
      const loading = Loading.service({
        lock: true,
        text: '正在读取列表',
        fullscreen: true,
        background: 'rgba(255, 255, 255, 0.6)'
      })
      const result = await this.workdao.list({
        user: this.ctx.user.id
      })
      this.workList = result.list
      loading.close()
    },
    editSlide (work) {
      this.ctx.editWork = work
      this.$router.push('/slide/lite')
    },
    async removeSlide (work) {
      await MessageBox.confirm('删除作品后不可恢复 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await this.workdao.delete(work)
      for (let i = 0; i < this.workList.length; i++) {
        if (this.workList[i]._id === work._id) {
          this.workList.splice(i, 1)
          break
        }
      }
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
