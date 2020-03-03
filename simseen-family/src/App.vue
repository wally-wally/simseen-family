<template>
  <v-app>
    <Header></Header>
    <v-content>
      <router-view :key="$route.fullPath"></router-view>
    </v-content>
    <Footer></Footer>
  </v-app>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'

export default {
  components: {
    Header,
    Footer
  }
}
</script>

<style>

</style>