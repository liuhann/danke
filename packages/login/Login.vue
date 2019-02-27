<template>
<div class="login">
  <danke-header></danke-header>
  <van-panel title="用户登陆">
    <van-cell-group>
      <van-field
        v-model="phone"
        clearable
        label="手机号"
        placeholder="请输入手机号"
      />
      <van-field
        v-model="sms"
        center
        clearable
        label="短信验证码"
        placeholder="请输入短信验证码"
      >
        <van-button v-if="countDown === 0" slot="button" size="small" type="primary" @click="sendSmsCode">发送验证码</van-button>
        <van-button v-else slot="button" size="small" type="primary" plain>{{countDown}}秒后再次发送</van-button>
      </van-field>
      <van-cell>
        <van-button type="primary" @click="login">登录</van-button>
      </van-cell>
    </van-cell-group>
  </van-panel>
</div>
</template>

<script>
import DankeHeader from '../common/DankeHeader'

export default {
  name: 'Home',
  components: { DankeHeader },
  data () {
    return {
      phone: '',
      sms: '',
      countDown: 0
    }
  },

  created () {
    setInterval(() => {
      if (this.countDown !== 0) {
        this.countDown --
        // window.localStorage.setItem('sms.countdown', this.countDown)
      }
    }, 1000)
  },

  methods: {
    sendSmsCode () {
      if (this.countDown === 0 && this.isPoneAvailable(this.phone)) {
        this.ctx.userdao.sendSmsCode(this.phone)
        this.countDown = 90
      } else {
        this.ctx.vant.Dialog.alert({
          message: '错误的手机号码'
        })
      }
    },

    isPoneAvailable(phone) {
      if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(phone)) {
        return false
      } else {
        return true
      }
    },

    async login () {
      let result = await this.ctx.userdao.loginWithSms(this.phone, this.sms)
    }

  }
}
</script>

<style lang="less">
.login {
  font-size: 20px;
}
</style>
