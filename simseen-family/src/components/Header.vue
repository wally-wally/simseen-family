<template>
  <v-app-bar fixed color="#F4F2DB" class="header-wrapper">
    <router-link to="/" style="text-decoration: none;">
      <span class="homepage-name" @click="toggleEvent(0)">Simpson Family</span>
    </router-link>
    <router-link v-if="familyAuth" to="/memo" style="text-decoration: none; color: black;">
      <div class="login-name" @click="toggleEvent(3)">{{ user }}<i class="fas fa-star" v-if="familyAuth"></i></div>
    </router-link>
    <div v-else class="login-name">{{ user }}</div>
    <v-spacer></v-spacer>
    <nav class="nav" v-if="!isLogin">
      <span v-if="!isLogin" class="google-login-icon" @click="loginWithGoogle"><i class="fab fa-google"></i></span>
    </nav>
    <nav class="nav" v-else>
      <div v-if="!dropDownOn" class="dropdown"><i class="fas fa-ellipsis-v d-block" @click="dropDownOn = true"></i></div>
      <div v-else class="dropdown"><i class="fas fa-ellipsis-h d-block" @click="dropDownOn = false"></i></div>
      <!-- <router-link v-if="familyAuth" to="/dinner">
        <span id="dinner-icon" @click="toggleEvent(2)">
          <img src="../assets/dinner_icon.png" alt="dinner_icon" width="25" id="dinner-img-icon">
        </span>
      </router-link>
      <router-link v-if="familyAuth" to="/notice"><i class="fas fa-clipboard-list notice-icon" @click="toggleEvent(1)"></i></router-link>
      <span class="google-logout-icon" @click="logoutDialog = true"><i class="fab fa-google"></i></span> -->
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
          <v-btn small color="#E6CC00" @click="logoutDialog = false; dropDownOn = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <transition name="fade">
      <div v-if="dropDownOn" class="dropdown-menu d-block">
        <div class="dropdown-element" @click="toggleEvent(2)">
          <router-link v-if="familyAuth" to="/dinner" class="dropdown-element" style="text-decoration: none; color: black;">
            <div id="dinner-icon">
              <img src="../assets/dinner_icon.png" alt="dinner_icon" width="25" id="dinner-img-icon">
              <span class="dropdown-menu-title">영숙이의 급식소</span>
            </div>
          </router-link>
        </div>
        <div class="dropdown-element"  @click="toggleEvent(1)">
          <router-link v-if="familyAuth" to="/notice" style="text-decoration: none; color: black;">
            <i class="fas fa-clipboard-list notice-icon"></i>
            <span class="dropdown-menu-title">공지사항</span>
          </router-link>
        </div>
        <div class="comment-icon dropdown-element" @click="developDialog = true; dropDownOn = false">
          <i class="far fa-comment develop-comment-icon"></i>
          <span class="dropdown-menu-title">개발자 코멘트</span>
        </div>
        <div class="google-logout-icon dropdown-element" @click="logoutDialog = true">
          <i class="fab fa-google logout-icon"></i>
          <span class="dropdown-menu-title" style="color: black;">로그아웃</span>
        </div>
      </div>
    </transition>
    <v-dialog v-model="developDialog" persistent>
      <v-card>
        <v-card-title class="d-block pb-2 mb-3" :style="{ fontFamily: 'Yeon Sung', borderBottom: '1px solid lightgray'}">
          <div class="menu-dialog-title"><i class="fas fa-comment"></i>개발자 코멘트</div>
        </v-card-title>
        <v-card-text class="px-6 pb-1" :style="{ fontFamily: 'Poor Story' }">
          <div>
            <div class="comment-wrapper">
              <div class="comment-title"><strong>로그인 중일 때 로딩바 표시(2020.03.16.)</strong></div>
              <ul class="comment-contents">
                <li>그동안 로그인할 때 로그인이 됐는지 안 됐는지 구분이 잘 안가서 <strong style="color: crimson;">로그인할 때 로그인 중 이라는 표시와 문구를 추가했어요.</strong></li>
                <li>구글 로그인 하는 경우 <span style="color: darkblue;"><strong>'조금만 기다려주세요...'</strong></span>라는 문구가 나오고 로그인되면 자동으로 없어져요.</li>
                <li>단, 로그인하는 동안에는 유저, 이메일, 가족인증을 확인하기 때문에 아주 몇 초동안은 다른 기능들을 이용할 수 없으니 유의하세요.</li>
              </ul>
            </div>
            <div class="comment-wrapper">
              <div class="comment-title"><strong>메뉴 구성 드롭다운으로 변경(2020.03.15.)</strong></div>
              <ul class="comment-contents">
                <li><strong style="color: crimson;">상단 메뉴 아이콘들을 하나로 묶었어요.</strong></li>
                <li>각 아이콘 별로 어떤 내용인지 타이틀을 추가했어요.</li>
                <li>
                  <span style="color: darkblue;"><strong><i class="far fa-comment"></i>'개발자 코멘트'</strong></span>
                  를 새로 만들어서 어떤 내용이 바뀌었는지 설명해드릴께요.
                </li>
              </ul>
            </div>
            <div class="comment-wrapper">
              <div class="comment-title"><strong>장보기 메모장 기능 추가(2020.03.14.)</strong></div>
              <ul class="comment-contents">
                <li>메인 화면에서 <i class="fas fa-utensils"></i>'영숙이의 금식소' 밑에 
                  <span style="color: darkblue;"><strong><i class="fas fa-utensils"></i>'장보기 메모장'</strong></span>을 추가했어요.
                </li>
                <li>위의 식단 달력을 보면서 <strong style="color: crimson;">필요한 재료가 있으면 아래 메모장에 바로 적어보세요.</strong></li>
                <li>단, 1자 이상 작성해야 저장할 수 있어요.</li>
              </ul>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="pt-2 pb-4 pr-6" :style="{ fontFamily: 'Poor Story' }">
          <span></span>
          <v-spacer></v-spacer>
          <v-btn small color="#E6CC00" @click="developDialog = false">닫기</v-btn>
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
      dropDownOn: false,
      developDialog: false
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
      this.dropDownOn = false
    },
    resetSessionExpire() {
      this.dropDownOn = false
      if (this.isLogin) {
        this.$store.commit('checkSession')
        let vm = this
        if (vm.user === '' && (vm.$store.state.clickNotice || vm.$store.state.clickDinner || vm.$store.state.clickBible || vm.$store.state.clickMemo)) {
          vm.$router.push('/')
        }
      }
    },
    toggleEvent(status) {
      this.$store.state.clickInit = false
      this.$store.state.clickBible = false
      if (status === 0) {
        this.$store.state.clickTitle = true
        this.$store.state.clickNotice = false
        this.$store.state.clickDinner = false
        this.$store.state.clickMemo = false
      } else if (status === 1) {
        this.$store.state.clickTitle = false
        this.$store.state.clickNotice = true
        this.$store.state.clickDinner = false
        this.$store.state.clickMemo = false
      } else if (status === 2){
        this.$store.state.clickTitle = false
        this.$store.state.clickNotice = false
        this.$store.state.clickDinner = true
        this.$store.state.clickMemo = false
      } else {
        this.$store.state.clickTitle = false
        this.$store.state.clickNotice = false
        this.$store.state.clickDinner = true
        this.$store.state.clickMemo = true
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
  .google-logout-icon,
  .notice-icon,
  #dinner-icon,
  .comment-icon {
    font-size: 25px;
    text-shadow: 3px 3px 6px lightgray;
  }

  .notice-icon {
    vertical-align: bottom;
    margin-left: 2px;
    margin-right: 13px;
  }

  #dinner-img-icon,
  .logout-icon {
    vertical-align: middle;
    margin-right: 10px;
  }

  .develop-comment-icon {
    vertical-align: text-bottom;
    margin-right: 8px;
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

  /* .header-wrapper {
    position:relative;
  } */

  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0%;
    width: 150px;
    background-color: #fff;
    border: 0.8px solid #E7E7E7;
    border-radius: 4px;
    box-shadow: 3px 3px 0.6em rgba(197, 189, 189, 0.5);
    padding: 0 6px;
  }

  .dropdown-menu-title {
    font-size: 0.83rem;
    font-family: 'Noto Sans KR';
    text-shadow: none;
  }

  .dropdown-element {
    padding: 8px 0;
  }

  .dropdown-element:first-child {
    padding: 5px 0;
  }

  .dropdown-element:last-child {
    padding-top: 0;
    padding-bottom: 7px;
  }

  .dropdown-element:not(:last-child) {
    border-bottom: 1px solid lightslategray;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .comment-wrapper:not(:last-child) {
    margin-bottom: 1.7em;
  }

  .comment-title {
    font-size: 1.15em;
    margin-bottom: 5px;
  }

  .comment-contents > li{
    margin-bottom: 2px;
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