import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import Vuetify from 'vuetify/lib'
import 'vuetify/dist/vuetify.min.css'
import 'font-awesome/css/font-awesome.min.css'

import * as Vueperslides from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

import AOS from 'aos'
import 'aos/dist/aos.css'
// import vuetify from './plugins/vuetify';

Vue.prototype.$EventBus = new Vue();
Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(Vueperslides)
Vue.use(AOS)
AOS.init()

new Vue({
  router,
  store,
  vuetify: new Vuetify({
    iconfont: 'fa',
    theme: {
        primary: '#3f51b5',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        error: '#b71c1c'
    }
  }),
  beforeCreate() {
    this.$store.dispatch('getMemberInfo')
  },
  // vuetify,
  render: h => h(App)
}).$mount('#app')
