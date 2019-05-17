<template>
<div class="home">
  <nav-bar></nav-bar>

  <div class="section">

  </div>
  <van-panel title="我的作品">
    <van-card v-for="work in works"
              :key="work.id"
              :num="work.scenes"
              :thumb="work.image || ImageDefault"
              :centered="true"
              :title="work.title || '未命名'"
    >
      <div slot="footer">
        <van-button @click="confirmRemoveWork(work.id)" size="small">删除</van-button>
        <van-button @click="openWork(work.id)" size="small">编辑</van-button>
      </div>
    </van-card>
  </van-panel>
  <van-popup v-model="pop.screenType" class="choose-screen-type">
    <tab-choose-type @choose="choose"></tab-choose-type>
  </van-popup>
</div>
</template>

<script>
import LogoWrapper from '../common/site/LogoWrapper'
import TabChooseType from './TabChooseType'
import ImageDefault from './photo.svg'
import DankeHeader from '../common/site/DankeHeader'
import NavBar from '../common/site/NavBar'
export default {
  name: 'Home',
  components: {NavBar, DankeHeader, TabChooseType, LogoWrapper},
  data () {
    return {
      pop: {
        screenType: false
      },
      elementCollapseName: 0,
      works: []
    }
  },
  computed: {
    ImageDefault () {
      return ImageDefault
    }
  },
  created () {
    this.listWork()
  },
  methods: {
    choose (type) {
      this.ctx.work = null
      this.$router.replace('/designer?type=' + type)
    },
    async listWork () {
      const result = await this.ctx.workdao.listMine()
      this.works = result.list
    },
    openWork (id) {
      this.$router.push('/designer?id=' + id)
    },
    confirmRemoveWork (id) {
      this.ctx.vant.Dialog.confirm({
        message: '是否确认删除此作品'
      }).then(async () => {
        const toast = Toast.loading({
          duration: 0,       // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: 'spinner'
        })
        await this.ctx.workdao.removeWork(id)
        this.listWork()
        Toast.clear()
      }).catch(() => {
      });
    }
  }
}
</script>


<style lang="less">

.home {
  .choose-screen-type {
    width: 80%;
    .van-cell {
      svg {
        margin-left: -10px;
      }
    }
  }
}
</style>
