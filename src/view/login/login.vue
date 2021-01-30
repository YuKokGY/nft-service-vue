<template>
  <div class="login">
    <!--    <div class="team-name hidden-sm-and-down"><img src="@/assets/image/login/team-name.png" alt="logo" /></div>-->
    <div v-loading="loading" class="form-box" element-loading-background="rgba(0, 0, 0, 0)">
      <div class="box">
        <div class="title"><h1> CMS DEMO</h1></div>
        <form autocomplete="off" class="login-form" @submit.prevent="throttleLogin()">
          <div class="form-item nickname">
            <span class="icon account-icon"></span>
            <input v-model="form.username" autocomplete="off" onblur="this.placeholder='请填写用户名'"
                   onfocus="this.placeholder=''" placeholder="请填写用户名" type="text"/>
          </div>
          <div class="form-item password">
            <span class="icon secret-icon"></span>
            <input v-model="form.password" autocomplete="off" onblur="this.placeholder='请填写用户登录密码'"
                   onfocus="this.placeholder=''" placeholder="请填写用户登录密码" type="password"/>
          </div>
          <div class="s_btn">
            <button class="submit-btn" type="submit">登录</button>
            <button class="submit-btn" type="button" @click="setEmpty">重置</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapMutations} from 'vuex'
import AppConfig from '@/config/index'
import User from '@/lin/model/user'
import Utils from '@/lin/util/util'

export default {
  name: 'login',
  data() {
    return {
      loading: false, // 加载动画
      wait: 2000, // 2000ms之内不能重复发起请求
      throttleLogin: null, // 节流登录
      form: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    async login() {
      const {username, password} = this.form
      if (this.form.username === '' || this.form.password === '') {
        this.$message.error('用户名或密码不能为空')
      } else {
        try {
          this.loading = true
          await User.getToken(username, password)
          await this.getInformation()
          this.loading = false
          this.$router.push(AppConfig.defaultRoute)
          this.$message.success('登录成功')
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      }
    },
    async getInformation() {
      try {
        // 尝试获取当前用户信息
        const user = await User.getPermissions()
        this.setUserAndState(user)
        this.setUserPermissions(user.permissions)
      } catch (e) {
        console.log(e)
      }
    },
    async setEmpty() {
      this.form.username = ''
      this.form.password = ''
    },
    ...mapActions(['setUserAndState']),
    ...mapMutations({
      setUserPermissions: 'SET_USER_PERMISSIONS',
    }),
  },
  created() {
    // 节流登录
    this.throttleLogin = Utils.throttle(this.login, this.wait)
  },
  components: {},
}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  background-size: auto;
  //background: #1b2c5f url('../../assets/image/login/login-ba.png') no-repeat center center;
  background: linear-gradient(to right, #acb6e5, #86fde8);

  .team-name {
    position: fixed;
    left: 40px;
    top: 50%;
    width: 50px;
    transform: translateY(-50%);
  }

  .box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    padding: 50px;
    background: rgba(255, 255, 255, 0.4);
    box-sizing: border-box;
    box-shadow: 0px 15px 25px rgba(0, 0, 0, .5);
    border-radius: 15px;
  }

  .form-box {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 445px;

    .title {
      height: 37px;
      font-size: 30px;
      line-height: 37px;
      margin-bottom: 15%;

      h1 {
        padding-left: 74px;
        box-sizing: border-box;
        text-align: left;
        color: #1a1e24;
      }
    }

    .login-form {
      width: 100%;

      .form-item {
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        padding-bottom: 13px;
        margin-bottom: 34px;

        input {
          width: 100%;
          height: 100%;
          background: transparent;
          color: #4c4d4e;
          font-size: 14px;
          padding-left: 24px;
          box-sizing: border-box;
          transition: .5s;
        }

        //:focus::placeholder {
        //  top: -18px;
        //  left: 0;
        //  color: #03a9f4;
        //  font-size: 14px;
        //}
      }

      .form-item.nickname {
        //background: url('../../assets/image/login/nickname.png') no-repeat;
        //background-size: 100% auto;
        //background-position: left bottom;
        border-bottom: 1px solid #b0acac;
        outline: none;
        background: transparent;
      }

      .form-item.password {
        //background: url('../../assets/image/login/password.png') no-repeat;
        //background-size: 100% auto;
        //background-position: left bottom;
        border-bottom: 1px solid #b0acac;
        outline: none;
        background: transparent;
      }

      .s_btn {
        display: flex;
        justify-content: space-around;
      }

      .submit-btn {
        width: 30%;
        height: 60px;
        color: #e9e4e4;
        font-size: 16px;
        text-align: center;
        box-sizing: border-box;
        padding: 0 10px;
        //padding-left: 74px;
        //background: url('../../assets/image/login/login-btn.png') no-repeat;
        background-size: 90% auto;
        background: center bottom #4d74ac;
        box-shadow: 0px 15px 25px rgba(0, 0, 0, .3);
        border: none;
        cursor: pointer;
        border-radius: 15px;
      }

      .submit-btn:active {
        box-shadow: 0px 15px 25px rgba(0, 0, 0, 0);
        transition: .2s;
      }
    }
  }
}
</style>
