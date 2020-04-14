<template>
<div id="user-profile">
  <form @submit.prevent="updateUserProfile">
    <fieldset>
      <label>用户账号</label>
      <span>{{user.id}}</span>
    </fieldset>
    <fieldset>
      <label>用户名</label>
      <span><input type="text" v-model="user.nick"/></span>
    </fieldset>
    <fieldset>
      <label>位置</label>
      <span><input type="text" v-model="user.location"/></span>
    </fieldset>
    <fieldset>
      <label>电子邮件</label>
      <span><input type="text" v-model="user.email"/></span>
    </fieldset>
    <fieldset>
      <button type="submit">保存</button>
      <button type="button" class="danger" @click="logout">退出登录</button>
    </fieldset>
  </form>
</div>
</template>

<script>
import { Popover, Upload, Message } from 'element-ui'
import ImageDAO from '../utils/imagedao'
import { getImageUrl } from '../xd-builder/mixins/imageUtils'
export default {
  name: 'UserHome',
  components: {
    [Upload.name]: Upload
  },
  data () {
    return {
      user: this.ctx.user
    }
  },
  computed: {
    avatar () {
      if (this.user && this.user.avatar) {
        return this.getImageUrl(this.user.avatar, 96, 96)
      } else {
        return 'http://cdn.danke.fun/res/head.svg'
      }
    }
  },

  created () {
    this.imagedao = new ImageDAO(this.ctx)
  },
  methods: {
    getImageUrl,
    async avatarChosen (file, uploadFiles) {
      const result = await this.imagedao.uploadBlob(file.raw, `profile`)
      await this.ctx.userdao.setAvatar(result.name)
      const user = await this.ctx.userdao.getCurrentUser()
      this.ctx.user = user
      this.user = user
    },

    async logout () {
      await this.ctx.userdao.logout()
      this.$route.replace('/')
    },

    async updateUserProfile () {
      await this.ctx.userdao.setUserProfile({
        email: this.user.email,
        nick: this.user.nick,
        location: this.user.location
      })
      const user = await this.ctx.userdao.getCurrentUser()
      this.ctx.user = user
      this.user = user
      Message.success({
        message: '用户状态更新成功'
      })
    }
  }
}
</script>

<style lang="scss">
#user-profile {
  padding: 20px;
  fieldset {
    width: 360px;
    margin-bottom: 20px;
    img {
      width: 100px;
      height: 100px;
      border-radius: 100%;
    }
    label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      color: #0d0c22;
      margin-bottom: 10px;
    }
    input {
      border-color: rgba(0,0,0,0.1);
      border-width: 1px;
      font-weight: 400;
      line-height: 24px;
      width: 100%;
      box-sizing: border-box;
      height: 40px;
      padding: 10px 16px;
      outline: none;
      border-radius: 3px;
      transition: background-color 200ms ease, outline 200ms ease, color 200ms ease, box-shadow 200ms ease;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      color: #0d0c22;
      background-color: #fefefe;
      &:hover {
        box-shadow: 0 0 0 4px #eee;
        background-color: #fff;
      }
    }
  }
}
</style>
