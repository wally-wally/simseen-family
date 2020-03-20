<template>
  <v-app :class="this.loginLoading ? 'all-wrapper' : ''">
    <div :class="this.loginLoading ? 'background-black' : ''"></div>
    <div :class="this.loginLoading ? 'loader' : ''"></div>
    <span :class="this.loginLoading ? 'loading-alert' : ''"></span>
    <Header></Header>
    <v-content>
      <router-view></router-view>
    </v-content>
    <Footer></Footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import Header from './components/common/Header'
import Footer from './components/common/Footer'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  computed: {
    ...mapState(['loginLoading'])
  },
  mounted() {
    window.onbeforeunload = () => {
      if (document.readyState === 'complete') {
        this.$store.commit('checkSession')
      }
    }
  }
}
</script>

<style scoped>
  @import url('./assets/css/loader.css');
</style>