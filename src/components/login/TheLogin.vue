<script setup>
import { accountLogin, profile } from '../../network/user'
import { qrcode, heartbeat } from '../../network/oauth2'
import { useUserStore } from '../../store/user'
import { ref } from 'vue'
const props = defineProps({
  signinOrSingup: {
    type: String,
    required: true
  }
})
var isActive = ref(true)
function handleSigninType(active) {
  isActive.value = active
  if (active) {
    // 账号密码登录
    phone = ''
    loginSmsCode = ''
  } else {
    account = ''
    password = ''
  }
}
var areacode = ref('+86')
var isHidePass = ref(true)
var textOrPass = ref('password')
var timer = null
var heartbeattimer = null
var count = null
function handleShowPass() {
  isHidePass.value = !isHidePass.value
  if (isHidePass.value) {
    textOrPass.value = 'password'
  } else {
    textOrPass.value = 'text'
  }
}
var account = ''
var password = ''
var phone = ''
var loginSmsCode = ''
var isCanSend = ref(true)
var reqLoginSmsCode = ref('获取验证码')
function sendLoginSmsCode() {
  isCanSend.value = false
  const TIME_COUNT = 60
  if (!timer) {
    count = TIME_COUNT
    timer = setInterval(() => {
      if (count > 0 && count <= TIME_COUNT) {
        count--
        reqLoginSmsCode.value = '重新获取 ' + count
      } else {
        reqLoginSmsCode.value = '获取验证码'
        isCanSend.value = true
        clearInterval(timer)
        timer = null
      }
    }, 1000)
  }
}
function handleAccountLogin() {
  accountLogin(account, password).then((resp) => {
    if (resp.status == 200 && resp.data.code == 0) {
      const user = useUserStore()
      user.editToken(resp.headers['x-jwt-token'])
      user.editLoginStatus(true)
      profile()
    }
  })
}
function handlSmsCodeLogin() { }

function smsCodeRegister() { }

var showWxScan = ref(false)
var qrcodeSrc = ref('')
function showWxLogin() {
  qrcode().then(resp => {
    if (resp.status == 200 && resp.data) {
      showWxScan.value = true
      qrcodeSrc.value = window.URL.createObjectURL(resp.data)
      if (!heartbeattimer) {
        heartbeattimer = setInterval(() => {
          heartbeat(resp.headers.get('X-WX-Heart-Beat')).then(res => {
            if (res.status == 200 && res.data.data) {
              clearInterval(heartbeattimer)
              heartbeattimer = null
              window.location.reload()
            }
          })
        }, 2000)
      }
    }
  })
}
function closeWxSan() {
  showWxScan.value = false
  if (heartbeattimer) {
    clearInterval(heartbeattimer)
    heartbeattimer = null
  }
}
function closeHeartBeat() {
  if (heartbeattimer) {
    clearInterval(heartbeattimer)
    heartbeattimer = null
  }
}
defineExpose({ closeHeartBeat })
</script>
<template>
  <div class="container">
    <!-- 非第三方登录 -->
    <div class="signin" v-if="!showWxScan">
      <div class="sign-header">
        <h1>
          <span v-if="props.signinOrSingup == 'signin'"
            :class="{ active: isActive }"
            @click="handleSigninType(true)">账号登录</span>
          <span v-if="props.signinOrSingup == 'signin'" class="sms-signin"
            :class="{ active: !isActive }"
            @click="handleSigninType(false)">验证码登录</span>
          <span v-if="props.signinOrSingup == 'signup'" class="sms-signin"
            @click="handleSigninType(false)"
            style="margin-left: 0px; color: #1c1f21">快速注册</span>
        </h1>
        <i class="iconfont icon-close close-btn"
          @click="$emit('handleHideLogin')"></i>
      </div>
      <div class="sign-body">
        <div v-if="isActive && props.signinOrSingup == 'signin'" class="clearfix">
          <form autocomplete="off">
            <div class="pr">
              <input class="phone ipt" type="text" v-model="account"
                maxlength="37" name="phoneOrEmail" placeholder="请输入手机号/邮箱"
                autocomplete="off" />
              <p class="error-account"></p>
            </div>
            <div class="pr">
              <span class="eye" @click="handleShowPass">
                <i class="iconfont icon-hide" v-if="isHidePass"></i>
                <i class="iconfont icon-show" v-else></i>
              </span>
              <input class="email ipt" :type="textOrPass" v-model="password"
                maxlength="37" name="password" placeholder="请输入密码"
                autocomplete="off" />
              <p class="error-account"></p>
            </div>
            <p class="global-error"></p>
            <div class="login-btn clearfix" @click="handleAccountLogin">
              <input type="button" value="登录" class="btn-full" />
            </div>
          </form>
        </div>
        <div v-else class="clearfix">
          <form autocomplete="off">
            <div class="pr">
              <div class="areacode">{{ areacode }}</div>
              <input id="sms_login_phnoe" class="phone ipt" type="text"
                maxlength="11" name="phone" v-model="phone"
                placeholder="短信登录仅限中国大陆用户" autocomplete="off" />
              <p class="error-account"></p>
            </div>
            <div class="pr">
              <input class="sms ipt" :type="textOrPass" v-model="loginSmsCode"
                maxlength="6" name="smscode" placeholder="请输入短信验证码"
                autocomplete="off" />
              <p class="req-code" @click="sendLoginSmsCode">
                <span style="cursor: pointer" v-if="isCanSend">{{ reqLoginSmsCode
                }}</span>
                <span v-else style="color: #9199a1">{{ reqLoginSmsCode }}</span>
              </p>
              <p class="error-account"></p>
            </div>
            <p class="global-error"></p>
            <div class="login-btn clearfix">
              <input v-if="props.signinOrSingup == 'signin'" type="button"
                value="登录" class="btn-full" @click="handlSmsCodeLogin" />
              <input v-if="props.signinOrSingup == 'signup'" type="button"
                value="立即注册" class="btn-full" @click="smsCodeRegister" />
            </div>
          </form>
        </div>
      </div>
      <div class="sign-footer">
        <div class="third-party">
          <span class="third-party-span">扫码登录</span>
        </div>
        <div @click="showWxLogin" class="third-parties clearfix">
          <span class="weixin">
            <i class="iconfont icon-wechat"></i>
          </span>
        </div>
      </div>
    </div>
    <!-- 第三方登录 -->
    <div class="signin" v-if="showWxScan" id="wechatscan">
      <div class="sign-header"
        style="display: flex; align-items: center;justify-content: center;padding-bottom: 0px;">
        <h1>
          <span>微信扫码关注公众号登录</span>
        </h1>
        <i class="iconfont icon-close close-btn" @click="closeWxSan"
          style="padding-top: 10px;"></i>
      </div>
      <div class="sign-body">
        <div class="clearfix">
          <img :src="qrcodeSrc" style="height: 320px;">
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  opacity: 1;
  position: fixed;
  background: #fff;
  z-index: 9999;
  width: 384px;
  padding-top: 25px;
  padding-bottom: 15px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 12px 24px 0 rgba(28, 31, 33, 0.1);
  border-radius: 12px;
  height: fit-content;
}

.sign-header {
  position: relative;
  padding: 0 20px 25px 30px;
  background-size: cover;
  margin: 0;
}

.sign-header h1 {
  font-size: 18px;
  line-height: 40px;
  font-weight: 700;
  height: 40px;
  color: #787d82;
  margin: 0;
  padding: 0;

  span {
    float: left;
    text-align: center;
    height: 40px;
    line-height: 40p;
    cursor: pointer;
  }
}

.sign-header h1 {
  display: block;
  margin-block-start: 0.67rem;
  margin-block-end: 0.67rem;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}

.sign-body {
  margin: 0;
  padding: 0 32px;
  background-size: cover;
  display: block;

  .clearfix {
    margin: 0;
    padding: 0;
    display: block;

    form {
      display: block;
      margin: 0;
      padding: 0;
    }
  }

  .clearfix::after {
    content: '\0020';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}

.close-btn {
  position: absolute;
  top: 2px;
  right: 20px;
  width: 17px;
  height: 17px;
  font-size: 25px;
  padding-bottom: 0px;
  cursor: pointer;
}

.pr {
  position: relative;
  background-size: cover;
  margin: 0;
  padding: 0;
  display: block;

  .ipt {
    width: 100%;
    height: 48px;
    line-height: 20px;
    box-sizing: border-box;
    padding: 14px;
    box-shadow: 2px 0 5px 0 #fff;
    background: rgba(28, 31, 33, 0.06);
    border-radius: 8px;
    border: 0;
    color: #1c1f21;
    font-size: 14px;
    transition:
      border-color ease-in-out 0.15s,
      box-shadow ease-in-out 0.15s;
    outline: 0;
  }
}

.areacode {
  position: absolute;
  cursor: pointer;
  left: 16px;
  top: 12px;
  font-size: 16px;
  color: #1c1f21;
  text-align: left;
  line-height: 24px;
}

#sms_login_phnoe {
  padding-left: 57px !important;
}

.req-code {
  right: 14px;
  color: #37f !important;
  top: 12px;
  font-size: 14px;
  line-height: 24px;
  position: absolute;
  word-break: break-all;
  top: 12px;
  position: absolute;
  margin: 0;
  width: 80px;
}

.eye {
  font-size: 23px;
  color: #b5b9bc;
  position: absolute;
  top: 8px;
  right: 14px;
  cursor: pointer;
}

.eye_off::after {
  content: '\e8f5';
}

.error-account {
  clear: both;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  color: #ef1300 !important;
  word-break: break-all;
  margin: 0;
  padding: 0;
}

.btn-full {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 32px;
  line-height: 24px;
  border-radius: 24px;
  border-style: solid;
  border-width: 1px;
  cursor: pointer;
  transition: all 0.3s;
  color: #fff;
  background-color: #f20d0d;
  border-color: #f20d0d;
  opacity: 1;
  position: relative;
  display: inline-block;
  margin-bottom: 0;
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  text-decoration: none;
  white-space: nowrap;
  outline: none;
  user-select: none;
}

.sign-footer {
  padding: 20px 30px 4px;
  background-size: cover;

  .third-party {
    box-sizing: border-box;
    font-size: 16px;
    color: #f20d0d;
    text-align: center;
    line-height: 24px;
    margin-bottom: 24px;
    background-size: cover;

    .third-party-span {
      font-size: 16px;
      color: #1c1f21;
      text-align: center;
      line-height: 24px;
    }
  }

  .third-parties {
    text-align: center;
    font-size: 14px;
    margin-bottom: 24px;
    background-size: cover;

    .weixin {
      position: relative;
      background-color: #e5ffe1;
      color: #00cc63;

      display: block;
      width: 48px;
      height: 48px;
      border-radius: 100px;
      margin: auto auto;
      cursor: pointer;

      i {
        font-size: 24px;
        line-height: 48px;
      }
    }

    .weixin::after {
      content: '推荐登录';
      position: absolute;
      top: -18px;
      left: 4px;
      width: 4em;
      padding: 6px 10px;
      font-size: 16px;
      background-color: #fff;
      border: 2px solid #d4ffe9;
      border-radius: 100px 100px 100px 0;
      transform: scale(0.5);
    }
  }
}

.active {
  color: #f20d0d;
}

.active::after {
  content: ' ';
  width: 16px;
  height: 4px;
  line-height: 4px;
  background: #f20d0d;
  border-radius: 2px;
  display: block;
  margin: 0 auto;
}

.sms-signin {
  margin-left: 32px;
}
</style>
../../store/user
