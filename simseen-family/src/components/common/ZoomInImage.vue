<template>
  <v-dialog v-model="zoomInImgDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-card-title class="px-2 pt-2 pb-1">
        <span v-if="this.zoomInImgUrl.length === 1" class="zoom-in-img-title"><i class="fas fa-expand"></i></span>
        <span v-else class="zoom-in-img-title"><i class="fas fa-search"></i></span>
      </v-card-title>
      <v-card-text class="px-2 pt-1 pb-2">
        <p v-for="i in this.zoomInImgUrl.length" class="text-center mx-0 my-1" :key="i">
          <img :src="zoomInImgUrl[i - 1]" id="notice-main-zoomin-dialog">
        </p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="px-2 py-4">
        <span></span>
        <v-spacer></v-spacer>
        <v-btn small color="#E6CC00" @click="closeDialog()">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ZoomInImage',
  props: ['zoomInImgDialog', 'zoomInImgUrl'],
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>
  .zoom-in-img-title .fa-expand::after {
    content: ' 이미지 확대';
    font-family: 'Yeon Sung';
  }

  .zoom-in-img-title .fa-search::after {
    content: ' 모든 이미지 보기';
    font-family: 'Yeon Sung';
  }

  @media (orientation: portrait) {
    #notice-main-zoomin-dialog {
      margin: 0 auto;
      width: 100%;
    }
  }

  @media (orientation: landscape) {
    #notice-main-zoomin-dialog {
      margin: 0 auto;
      width: 70%;
    }
  }
</style>