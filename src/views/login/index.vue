<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="loginForm" ref="loginForm" label-position="left" label-width="0px"
      class="card-box login-form">
      <h3 class="title">vue-element-admin</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="username" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          placeholder="password"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          Sign in
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import { isvalidUsername } from '@/utils/validate'
// import { setToken } from '@/utils/auth'

export default {
  name: 'login',
  data() {
    return {
      pwdType: 'password',
      loading: false,
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  created: function() {
    // setToken(this.$route.query.token);
    // this.$router.push({ name: 'goods' })
  },
  methods: {
    showPwd() {
      this.pwdType = this.pwdType == 'password' ? 'text' : 'password';
    },
    handleLogin() {
      this.$store.dispatch('Login', this.loginForm).then(() => {
        this.$router.push({ name: 'goods' });
      });
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss">


</style>
