<template>
  <v-app-bar fixed color="#F4F2DB">
    <router-link to="/" style="text-decoration: none;">
      <span class="homepage-name" @click="toggleEvent(0)">Simpson Family</span>
    </router-link>
    <div v-if="user !== '' && user !== 'a'" class="login-name">{{ user }}<i class="fas fa-star" v-if="familyAuth"></i></div>
    <v-spacer></v-spacer>
    <nav class="nav">
      <router-link v-if="familyAuth" to="/notice"><i class="fas fa-clipboard-list notice-icon" @click="toggleEvent(1)"></i></router-link>
      <span v-if="!isLogin" class="google-login-icon" @click="loginWithGoogle"><i class="fab fa-google"></i></span>
      <span v-if="isLogin" class="google-logout-icon" @click="logoutDialog = true"><i class="fab fa-google"></i></span>
    </nav>
    <v-dialog v-model="logoutDialog" persistent>
      <v-card>
        <v-card-text class="px-4 pt-4 pb-2" id="notice-card">
          <p class="text-center" style="font-size: 120px;"><i class="fas fa-sign-out-alt"></i></p>
          <p class="text-center" style="font-size: 1.3em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;">로그아웃을 하시겠습니까?</p>
          <p class="text-center" style="font-size: 0.9em; font-family: 'Noto Sans KR'">(하단 <span style="color: #FF5252;">'로그아웃'</span> 버튼을 누르면 로그아웃 됩니다.)</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <span></span>
          <v-spacer></v-spacer>
          <v-btn small color="error" @click="runLogout">로그아웃</v-btn>
          <v-btn small color="#E6CC00" @click="logoutDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Header',
  data() {
    return {
      logoutDialog: this.$store.state.logoutDialog,
    }
  },
  mounted() {
    this.resetSessionExpire()
  },
	methods: {
    ...mapActions(['loginWithGoogle', 'logout']),
    runLogout() {
      this.logout(0)
      this.logoutDialog = false
    },
    resetSessionExpire() {
      if (this.isLogin) {
        this.$store.commit('checkSession')
        let vm = this
        if (this.user === '' && vm.$store.state.clickNotice) {
          vm.$router.push('/')
        }
      }
    },
    toggleEvent(status) {
      this.$store.state.clickInit = false
      if (status === 0) {
        this.$store.state.clickTitle = true
        this.$store.state.clickNotice = false
      } else {
        this.$store.state.clickTitle = false
        this.$store.state.clickNotice = true
      }
    }
  },
  watch: {
    '$route': 'resetSessionExpire',
    isLogin() {
      this.$store.state.oldTime = this.isLogin ? new Date() : ''
    }
  },
  computed: {
    ...mapState(['isLogin', 'user', 'familyAuth'])
  }
}
</script>

<style scoped>
  .homepage-name {
    color: #605856;
    font-family: 'Caveat' ;
    font-weight: bold;
    font-size: 24px;
    text-shadow: 2px 2px 5px lightgray;
    -webkit-animation:blink 1.5s ease-in-out infinite alternate;
    -moz-animation:blink 1.5s ease-in-out infinite alternate;
    animation:blink 1.5s ease-in-out infinite alternate;
  }

  .login-name {
    font-family: 'Do Hyeon';
    margin: 0.25em 0 0 0.6em;
    position: relative;
  }

  .login-name > i {
    position: absolute;
    left: 100%;
    font-size: 10px;
    color: #F7DA0F;
    text-shadow: 2px 2px 6px gray;
  }

  .google-login-icon,
  .google-logout-icon {
    font-size: 25px;
    text-shadow: 3px 3px 6px lightgray;
  }

  .notice-icon {
    font-size: 25px;
    margin-right: 20px;
    text-shadow: 3px 3px 6px lightgray;
  }

  .google-login-icon {
    color: darkslategrey;
  }

  .google-logout-icon {
    color: #0083D3;
  }

  .notice-icon {
    color: #FF420F;
  }

  .google-login-icon:hover,
  .google-logout-icon:hover,
  .notice-icon:hover {
    cursor: pointer;
  }

  @-webkit-keyframes blink{
    0% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes blink{
    0% {
      opacity:0.4;
    }

    100% {
      opacity:1;
    }
  }

  @keyframes blink{
    0% {
      opacity:0.4;
    }

    100% {
      opacity:1;
    }
  }
</style>