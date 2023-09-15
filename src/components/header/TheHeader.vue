<script setup>
import { ref } from 'vue'
import Login from '../login/TheLogin.vue'
import BGCover from '../bgcover/BGCover.vue'
import { useUserStore } from '../../store/user';
const user = useUserStore()
const menus = ref([])
var showLogin = ref(false)
var signinOrup = ref('signin')

function isSearch() {
  return true
}

function showAvatar() {
  return user.login
}

function handleShowLogin(inorUp) {
  signinOrup.value = inorUp
  showLogin.value = true
}

const loginDom = ref(null);
function handleHideLogin() {
  showLogin.value = false
  loginDom.value.closeHeartBeat()
}
</script>
<template>
  <div class="container">
    <div class="header-wrapper">
      <div class="header-left">
        <a href="" class="logo"></a>
        <div class="info">
          <div class="menu-wrapper">
            <div class="menu">
              <a v-for="(menu, index) in menus" :key="index" :href="menu.href"
                class="menu-item">
                <div class="menu-link">{{ menu.menu }}</div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="header-right">
        <div class="search" v-if="isSearch()">
          <div class="search-input">
            <div class="input-wrapper">
              <input type="text" autocomplete="off" maxlength="100"
                class="input" />
            </div>
            <div class="search-btn">
              <span class="">搜索</span>
            </div>
          </div>
        </div>
        <div class="userinfo">
          <div class="profile" v-if="showAvatar()">
            <a class="avatarwrap">
              <img src="" class="avatar" />
            </a>
          </div>
          <span class="control" v-else>
            <span id="line" class="pc"
              @click="handleShowLogin('signin')">登录</span>
            <span class="pc" @click="handleShowLogin('signup')">注册</span>
          </span>
        </div>
      </div>
    </div>
    <BGCover :showCover="showLogin" @handleHideLogin="handleHideLogin">
    </BGCover>
    <Login ref="loginDom" v-if="showLogin" :signinOrSingup="signinOrup"
      @handleHideLogin="handleHideLogin"></Login>
  </div>
</template>
<style lang="less" scoped>
.container {
  background: #fff;
  border-bottom: 1px solid #eaeaea;
  min-width: inherit;

  .header-wrapper {
    width: 1200px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: relative;

    .header-left {
      display: flex;
      align-items: center;
    }

    .header-right {
      display: flex;
      align-items: center;

      .search {
        position: relative;
        margin-left: 20px;
        margin-right: 36px;
        width: 320px;

        .search-input {
          display: flex;
          align-items: center;
          width: 100%;
          height: 36px;
          box-sizing: border-box;
          border: 1px solid #fa8919;
          border-radius: 8px;
          overflow: hidden;
        }

        .input-wrapper {
          flex: 1 1 auto;
          margin-left: 15px;
          margin-right: 15px;

          .input {
            width: 100%;
            font-size: 12px;
            font-weight: 400;
            color: #353535;
            outline: none;
            border: none;
            background: transparent;
          }
        }

        .search-btn {
          box-sizing: border-box;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 100%;
          line-height: 1;
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          text-align: center;
          cursor: pointer;
          user-select: none;
          background: #fa8919;
          transition: color 0.2s ease;
        }
      }

      .userinfo {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 65px;
        line-height: 100%;

        .profile {
          display: flex;
          height: 100%;
          align-items: center;
          justify-content: center;
          position: relative;

          .avatarwrap {
            position: relative;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            text-decoration: none;
            word-wrap: break-word;
          }

          .avatar {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 0;
            overflow-clip-margin: content-box;
            overflow: clip;
          }
        }

        .control {
          margin-top: 2px;
          white-space: nowrap;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;

          .pc {
            font-size: 16px;
            color: #888;
            display: block;
            line-height: 22px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            word-wrap: break-word;
          }
        }
      }
    }

    .logo {
      flex-shrink: 0;
      width: 120px;
      height: 65px;
      background-image: url(/logo.png);
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: contain;
    }

    .info {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1;
      flex-direction: row;
      justify-content: center;
      margin-left: 21px;
    }
  }
}

.menu {
  opacity: 1;
  transition: opacity 0.3s ease-out;
  white-space: nowrap;
  display: flex;
  align-items: center;

  .menu-item {
    color: #353534;
    display: flex;
    line-height: 20px;
    position: relative;
    padding: 8px 19px;
    font-weight: 500;
    transition: color 0.2s ease;
    white-space: nowrap;
    text-decoration: none;
    word-wrap: break-word;

    .menu-link {
      position: relative;
      display: block;
    }
  }
}

#line::after {
  content: '|';
  margin-left: 6px;
  margin-right: 6px;
}
</style>
