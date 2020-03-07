import Vue from 'vue'
import Vuex from 'vuex'
import VueSession from 'vue-session'
import jwtDecode from 'jwt-decode'
import FirebaseService from '@/services/FirebaseService'
// import axios from 'axios'

Vue.use(VueSession)
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: '',
    email: '',
    isLogin: false,
    isLoginError: false,
    familyEmails: '',
    familyAuth: false,
    getUserInfo: '',
    checkUser: false,
    logoutDialog: false,
    lastNoticeIndex: 0,
    clickTitle: true,
    clickNotice: false,
    clickDinner: false,
    clickInit: true,
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
      state.user = loginInfo[0]
      state.email = jwtDecode(loginInfo[1]).email
    },
    loginError(state) {
      state.isLogin = false
      state.isLoginError = true
    },
    logout(state) {
      state.isLogin = false
      state.isLoginError = false
      state.user = ''
      state.email = ''
      state.familyAuth = false
      state.logoutDialog = false
    },
    checkSession(state) {
      sessionStorage.removeItem('newTime')
      sessionStorage.setItem('newTime', new Date())
      let timeInterval = Date.parse(sessionStorage.getItem('newTime')) - Date.parse(sessionStorage.getItem('oldTime'))
      let sessionExpireTime = 1800
      if (timeInterval < sessionExpireTime * 1000) {
        let newValue = sessionStorage.getItem('newTime')
        sessionStorage.removeItem('oldTime')
        sessionStorage.removeItem('newTime')
        sessionStorage.setItem('oldTime', newValue)
        sessionStorage.setItem('newTime', new Date())
      } else {
        sessionStorage.removeItem('userName')
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('oldTime')
        sessionStorage.removeItem('newTime')
        state.isLogin = false
        state.isLoginError = false
        state.user = ''
        state.email = ''
        state.familyAuth = false
        state.logoutDialog = false
      }
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
      setTimeout(state.checkUser = true, 2000)
    }
  },
  actions: {
    async loginWithGoogle({dispatch}) {
      const encryptToken = function(originalToken) {
        let tokenLength = originalToken.length
        let frontToken = originalToken.slice(0, parseInt(tokenLength / 2))
        let backToken = originalToken.slice(parseInt(tokenLength / 2))
        let switchToken = backToken + frontToken
        return switchToken.split('').reverse().join('')
      }
      const result = await FirebaseService.loginWithGoogle()
      sessionStorage.setItem('token', encryptToken(result.credential.idToken))
      sessionStorage.setItem('userName', result.user.displayName)
      sessionStorage.setItem('oldTime', new Date())
      sessionStorage.setItem('newTime', '')
      dispatch('getMemberInfo')
    },
    logout({commit}) {
      sessionStorage.removeItem('userName')
      sessionStorage.removeItem('token')
      commit('logout')
    },
    async getMemberInfo({ commit }) {
      const decryptToken = function(token) {
        let tokenLength = token.length
        let switchToken = token.split('').reverse().join('')
        if (tokenLength % 2 === 0) {
          let frontToken = switchToken.slice(0, parseInt(tokenLength / 2))
          let backToken = switchToken.slice(parseInt(tokenLength / 2))
          let changeToken =  backToken + frontToken
          return changeToken.split('').join('')
        } else {
          let frontToken = switchToken.slice(0, parseInt(tokenLength / 2) + 1)
          let backToken = switchToken.slice(parseInt(tokenLength / 2) + 1)
          let changeToken = backToken + frontToken
          return changeToken.split('').join('')
        }
      }
      let familyEmails = await FirebaseService.getEmail()
      let name = sessionStorage.getItem('userName')
      let encryptToken = sessionStorage.getItem('token')
      commit('checkSession')
      if(name === null && encryptToken === null) return
      let token = decryptToken(encryptToken)
      commit('loginSuccess', [name, token])
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