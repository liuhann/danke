<template>
  <div id="add-new-work">
    <nav-bar />
    <section class="section">
      <button class="button is-plain" @click="back">返回</button>
    </section>
    <section class="section">
      <div class="columns is-mobile is-multiline channel-list is-1">
        <div v-for="(channel, index) in channels" :key="index" class="column channel-container is-6-mobile is-3-tablet is-2-desktop is-1-fullhd">
          <div class="box">
            <p class="title is-4">{{ channel.label }}</p>
            <figure class="image is-1by1">
            </figure>
            <button class="button is-success is-light" @click="newWork(channel.size)">创建</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { slideShow, video, appType } from './workType'
import channels from '../site/channels'
import { InputNumber } from 'element-ui'
import NavBar from '../site/components/NavBar'
export default {
  name: 'AddNew',
  components: {
    NavBar,
    [InputNumber.name]: InputNumber
  },
  data () {
    return {
      channels,
      appType,
      slideShow,
      video,
      columnHeight: 200,
      workWidth: 300,
      workHeight: 200
    }
  },
  methods: {
    workSizeStyle (work) {
      return {
        height: this.columnHeight + 'px',
        width: this.columnHeight / work.height * work.width + 'px'
      }
    },
    back () {
      this.$router.back()
    },
    newWork (size) {
      this.$router.push(`/xd-lite?width=${size.w}&height=${size.h}`)
    }
  }
}
</script>

<style lang="scss">

#add-new-work {

  .group {
    margin-top: 20px;
    .group-title {
      font-size: 1.75rem;
      padding:0 16px;
      color: #434343;
    }
  }
  .new-types {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    .work-type {
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 1px 4px 0 #dedee4;
      .name {
        margin-bottom: .8rem;
        font-size: 16px;
        color: #00bf72;
      }
      .ratios {
        color: #999;
      }
      .action {
        margin-top: 1.5rem;
        button {
          font-size: 1.2rem;
          color: #00c4cc;
          padding: 5px 10px;
          letter-spacing: .2rem;
          line-height: 1.4;
          transition: background-color .1s linear,border-color .1s linear,color .1s linear;
          vertical-align: middle;
          align-items: center;
          background-color: #fff;
          border: 1px solid #00c4cc;
          border-radius: 4px;
          cursor: pointer;
          text-align: center;
          &:hover {
            background-color: #00c4cc;
            color: #fff;
            transition: all .2s ease-in;
          }
        }
      }
    }
    .el-input-number--mini {
      width: 80px;
      margin: 0 10px;
    }
    .el-input-number.is-controls-right .el-input__inner {
      padding-left: 5px;
      padding-right: 28px;
    }
  }
}
</style>
