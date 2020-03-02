import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todayDate: new Date(),
    todayElements: new Date().toLocaleDateString().split('.').splice(0, 3),
    bibleCheckDayValue: null,
    dinnerCheckDayValue: null,
    notices: []
  },
  mutations: {
    convertDateValue(state, payload) {
      let checkDayElements = payload.checkDate.split('.').splice(0, 3)
      let month = checkDayElements[1].trim().length === 1 ? '0' + checkDayElements[1].trim() : checkDayElements[1].trim()
      let day = checkDayElements[2].trim().length === 1 ? '0' + checkDayElements[2].trim() : checkDayElements[2].trim()
      if (payload.componentName === 'Bible') {
        state.bibleCheckDayValue = Number(checkDayElements[0] + month + day)
      } else {
        state.dinnerCheckDayValue = Number(checkDayElements[0] + month + day)
      }
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