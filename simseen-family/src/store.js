import Vue from 'vue'
import Vuex from 'vuex'
import VueSession from 'vue-session'
import FirebaseService from '@/services/FirebaseService'

Vue.use(VueSession)
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: '',
    user: '',
    email: '',
    isLogin: false,
    isLoginError: false,
    familyEmails: '',
    familyAuth: false,
    logoutDialog: false,
    lastNoticeIndex: 0,
    todayDate: new Date(),
    todayElements: new Date().toLocaleDateString().split('.').splice(0, 3),
    bibleCheckDayValue: null,
    dinnerCheckDayValue: null,
    lastDinnerCheckDayValue: null,
    dayOfTheWeek: ['일', '월', '화', '수', '목', '금', '토']
  },
  mutations: {
    loginSuccess(state, loginInfo) {
      state.isLogin = true
      state.isLoginError = false
      state.accessToken = loginInfo[0]
      state.user = loginInfo[1]
      state.email = loginInfo[2]
    },
    loginError(state) {
      state.isLogin = false
      state.isLoginError = true
    },
    logout(state) {
      state.isLogin = false
      state.isLoginError = false
      state.user = ''
      state.accessToken = ''
      state.email = ''
      state.familyAuth = false
      state.logoutDialog = false
    },
    convertDateValue(state, payload) {
      let checkDayElements = payload.checkDate.split('.').splice(0, 3)
      let month = checkDayElements[1].trim().length === 1 ? '0' + checkDayElements[1].trim() : checkDayElements[1].trim()
      let day = checkDayElements[2].trim().length === 1 ? '0' + checkDayElements[2].trim() : checkDayElements[2].trim()
      if (payload.componentName === 'Bible') {
        state.bibleCheckDayValue = Number(checkDayElements[0] + month + day)
      } else if (payload.componentName === 'Dinner') {
        state.dinnerCheckDayValue = Number(checkDayElements[0] + month + day)
      } else {
        state.lastDinnerCheckDayValue = [checkDayElements[0], month, day].join('-')
      }
    },
    checkfamilyAuth(state, payload) {
      state.familyEmails = payload
      state.familyAuth = Object.entries(state.familyEmails[0].emails)
        .some(user => state.user && user[1] === state.email ? true : false)
    }
  },
  actions: {
    async loginWithGoogle({dispatch, commit}) {
      const result = await FirebaseService.loginWithGoogle()
      commit('loginSuccess',result.credential.accessToken,result.user)
      sessionStorage.setItem("accessToken", result.credential.accessToken)
      sessionStorage.setItem("userName", result.user.displayName)
      sessionStorage.setItem("email", result.user.email)
      dispatch("getMemberInfo")
    },
    logout({commit}) {
      sessionStorage.removeItem("accessToken")
      sessionStorage.removeItem("userName")
      sessionStorage.removeItem("email")
      commit('logout')
    },
    async getMemberInfo({ commit }) {
      let familyEmails = await FirebaseService.getEmail()
      let token = sessionStorage.getItem("accessToken")
      let name = sessionStorage.getItem("userName")
      let email = sessionStorage.getItem("email")
      if(token === null && name === null && email === null) return
      commit('loginSuccess', [token, name, email])
      commit('checkfamilyAuth', familyEmails)
    }
  },
  getters: {
    todayValue(state) {
      let month = state.todayElements[1].trim().length === 1 ? '0' + state.todayElements[1].trim() : state.todayElements[1].trim()
      let day = state.todayElements[2].trim().length === 1 ? '0' + state.todayElements[2].trim() : state.todayElements[2].trim()
      return [Number(state.todayElements[0] + month + day), [state.todayElements[0], month, day].join('-')]
    }
  }
})