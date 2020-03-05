<template>
  <v-app>
    <Header></Header>
    <v-content>
      <router-view></router-view>
    </v-content>
    <Footer></Footer>
  </v-app>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'

export default {
  name: 'App',
  components: {
    Header,
    Footer
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

<style>

</style>