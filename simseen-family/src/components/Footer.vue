<template>
  <v-footer dark padless>
    <v-card class="flex" flat tile>
      <v-card-text class="py-2 white--text text-center">
        Copyright ⓒ 2020 by <span class="editor" @click="goGithub()">wally-wally</span>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  methods: {
    goGithub() {
      window.open('https://github.com/wally-wally')
    }
  }
}
</script>

<style scoped>
  .editor {
    color: orange;
  }

  .editor:hover {
    cursor: pointer;
  }
</style>