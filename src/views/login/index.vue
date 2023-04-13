<template>
  <div
    class="login-container"
  >
    <!--el-form组件： elementUI插件里面的一个组件，经常展示表单元素  model： 用于收集表单数据 rules： 表单验证规则-->
    <el-form
      ref="loginForm"
      :model="loginFrom"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">LOGIN</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginFrom.username"
          placeholder="ID"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="password"
          v-model="loginFrom.password"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          show-password
        />
      </el-form-item>

      <el-button
        style="width: 50%; margin-bottom: 30px;margin-left: 110px;border-radius: 30px;color:white;
         background-color: rgba(255,255,255,0.1);box-shadow: 5px 5px 0 0  rgba(0,0,0,0.2);"
        @click.native.prevent="login"
      >登录</el-button>
      <!--      <router-link to="/register" class="reg">没有账号去注册</router-link>-->
    </el-form>
  </div>
</template>

<script>
// import { setToken } from '@/utils/auth'
export default {
  name: 'Login',
  data() {
    return {
      loginFrom: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async login() {
      console.log(this.loginFrom.passsword)
      const a = await this.$http.post('/login', {
        ID: parseInt(this.loginFrom.username),
        password: this.loginFrom.password
      })
      console.log(a)
      if (a.data.flag) {
        localStorage.setItem('token', this.loginFrom.username)
        // setToken(this.loginFrom.username)
        console.log(1)
        this.$router.push('/home')
      } else {
        localStorage.removeItem('token')
        alert('账号或密码错误！')
      }
    }
  }
}
// import { validUsername } from "@/utils/validate";
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 93.2%;
    margin-top: 3px;

    input {
      background: transparent;
      border: 0;
      //-webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 25px;
      color: $light_gray;
      height: 55px;
      caret-color: $cursor;

      &:-webkit-autofill {
        -webkit-text-fill-color: $cursor !important;
        -webkit-transition-delay: 99999s;
        -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: 450px;
    height: 65px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 95px;
    color: #454545;
    margin-top: -10px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  height: 100vh;
  width: 100%;
  background: url(~@/views/login/LoginBackgroundnew.jpg);
  background-size: 100% 100%;
  overflow: hidden;
}
.login-form {
  position: relative;
  width: 520px;
  max-width: 100%;
  padding: 160px 35px 0;
  overflow: hidden;
  box-shadow: 5px 5px 0 0  rgba(0,0,0,0.2);
  background-color: rgba(255,255,255,0.1);
  margin: 100px auto 0;
  border-radius: 90px;
}

.tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 10px;

  span {
    &:first-of-type {
      margin-right: 16px;
    }
  }
}

.svg-container {
  padding: 6px 5px 6px 15px;
  color: $dark_gray;
  vertical-align: middle;
  width: 30px;
  display: inline-block;
}

.title-container {
  position: relative;

  .title {
    font-size: 26px;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
.reg {
  color: #fff;
}
</style>
