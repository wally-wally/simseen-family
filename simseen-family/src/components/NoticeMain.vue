<template>
  <div>
    <div v-if="this.notice !== undefined" class="notice-main-content">
      <div class="notice-main-header d-flex justify-space-between">
        <div class="notice-main-title">{{ notice.title }}
          <span class="notice-main-date">{{ notice.created_at | shortedDate }}({{ this.dayOfTheWeek[notice.created_at.getDay()] }})</span>
        </div>
        <div class="notice-main-user">by {{ notice.user }}</div>
      </div>
      <div v-if="this.$store.state.isLogin && this.$store.state.familyAuth" class="notice-main-body">
        <p class="text-center img-section" v-if="this.notice.imgUrl[0] !== ''">
          <img :src="this.notice.imgUrl[0]" class="d-block" alt="notice-img" id="notice-img">
          <v-btn class="mx-2" id="more-img-button" fab dark x-small color="#FFAB00" @click="zoomInImg(notice.imgUrl)">
            <span v-if="this.notice.imgUrl.length === 1" class="img-more-count"><i class="fas fa-expand"></i></span>
            <span v-else class="img-more-count">+{{ this.notice.imgUrl.length - 1 }}</span>
          </v-btn>
        </p>
        <div class="text-justify" v-html="this.notice.body.split('\n').join('<br />')"></div>
      </div>
      <div v-else-if="this.$store.state.isLogin && this.$store.state.checkUser" class="notice-main-body">
        <p class="text-center" style="font-size: 100px;"><i class="far fa-meh"></i></p>
        <p class="text-center mt-6 mb-4" style="font-size: 1.3em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;">너 어디 집안이야(두둥)</p>
      </div>
      <div v-else class="notice-main-body">
        <p class="text-center" style="font-size: 100px;"><i class="far fa-grin-tongue"></i></p>
        <p class="text-center mt-6 mb-4" style="font-size: 1.3em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;">응, 넌 못 봐^^</p>
      </div>
    </div>
    <div v-else class="no-notice-section">
      <p class="text-center pa-2">
        <strong v-if="this.loadingState === 1">등록된 공지사항이 없습니다.</strong>
        <strong v-else>데이터를 불러오는 중입니다.</strong>
      </p>
    </div>
    <ZoomInImage :zoomInImgUrl="zoomInImgUrl" :zoomInImgDialog="zoomInImgDialog" @closeDialog="closeDialog"></ZoomInImage>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ZoomInImage from '@/components/ZoomInImage'

export default {
  name: 'NoticeMain',
  components: {
    ZoomInImage
  },
  props: {
    notice: { type: Object },
    loadingState: { type: Number }
  },
  data() {
    return {
      zoomInImgDialog: false,
      zoomInImgUrl: ''
    }
  },
  filters: {
    shortedDate(created_at) {
      let year = created_at.getFullYear() - 2000
      let month = created_at.getMonth() + 1
      let day = created_at.getDate()
      return `${year}.${month < 9 ? [0, month].join('') : month}.${day < 9 ? [0, day].join('') : day}`
    }
  },
  methods: {
    zoomInImg(url) {
      this.zoomInImgDialog = true
      this.zoomInImgUrl = url
      document.querySelector('#viewport').setAttribute('content', 'width=device-width, initial-scale=1.0')
    },
    closeDialog() {
      this.zoomInImgDialog = false
      this.zoomInImgUrl = ''
      document.querySelector('#viewport').setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no')
    }
  },
  computed: {
    ...mapState(['dayOfTheWeek'])
  }
}
</script>

<style scoped>
  .notice-main-content,
  .no-notice-section {
    background-color: #F4F2DB;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.05);
    font-family: 'Nanum Gothic';
  }

  .notice-main-title .notice-main-date {
    font-size: 11px;
    vertical-align: bottom;
  }

  .notice-main-content .notice-main-header {
    padding: 8px;
  }

  .notice-main-content .notice-main-header .notice-main-title {
    font-size: 15px;
    font-weight: bold;
  }

  .notice-main-content .notice-main-header .notice-main-user {
    font-size: 12px;
  }

  .notice-main-content .notice-main-body {
    border-top: 1px solid #E9D644;
    padding: 8px;
    font-size: 14px;
  }

  .img-section {
    position: relative;
  }

  .img-section #more-img-button {
    position: absolute;
    bottom: 0;
    right: -1.1em;
  }

  .img-section #more-img-button .img-more-count {
    font-size: 12px;
    font-family: 'Noto Sans KR';
  }

  @media (orientation: portrait) {
    p > img[id="notice-img"] {
      margin: 0 auto;
      width: 80%;
    }
  }

  @media (orientation: landscape) {
    p > img[id="notice-img"] {
      margin: 0 auto;
      width: 60%;
    }
  }
</style>