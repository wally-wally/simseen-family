<template>
  <div class="ma-4">
    <div class="notice-title">
      <div class="notice-title-body">
        <i class="fas fa-clipboard-list"><span v-if="this.$route.name === 'main'"> 최근</span></i>
      </div>
      <div class="notice-add-icon" @click="dialog = true" v-if="this.$store.state.familyAuth">
        <i class="fas fa-plus"></i>
      </div>
    </div>
    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title><span class="notice-add-dialog-title">공지 추가</span></v-card-title>
        <v-card-text id="notice-card">
          <v-form
            ref="form"
            v-model="valid">
            <v-text-field
              v-model="title"
              label="제목"
              :counter="10"
              :rules="titleRules"
              required></v-text-field>
            <v-textarea
              v-model="body"
              :counter="0"
              :rules="bodyRules"
              required
              label="내용"></v-textarea>
            <v-file-input accept="image/*" label="사진 첨부(선택)" v-model="imgFile" dense clearable></v-file-input>
            <v-card-actions>
              <span class="alert-section">{{ waitingMessage }}</span>
              <v-spacer></v-spacer>
              <v-btn small color="#E6CC00" :disabled="!valid" @click="postNotice()">작성</v-btn>
              <v-btn small color="error" @click="dialog = false">취소</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <NoticeMain v-if="this.$route.name === 'main'" :notices="notices" :loadingState="loadingState"></NoticeMain>
    <NoticeTable v-else :notices="notices"></NoticeTable>
  </div>
</template>

<script>
import axios from 'axios'
import FirebaseService from '@/services/FirebaseService'
import NoticeMain from '@/components/NoticeMain'
import NoticeTable from '@/components/NoticeTable'

export default {
  name: 'Notice',
  components: {
    NoticeMain,
    NoticeTable
  },
  data() {
    return {
      notices: [],
      dialog: false,
      valid: true,
      title: '',
      titleRules: [
        v => !!v || '제목을 작성하세요.',
        v => (v && v.length <= 10) || '최대 10자까지 작성 가능합니다.'
      ],
      body: '',
      bodyRules: [
        v => !!v || '내용을 작성하세요.',
        v => (v && v.length >= 10) || '최소 10자 이상 작성해야 합니다.'
      ],
      imgFile: undefined,
      imgUrl: '',
      waitingMessage: '',
      loadingState: 0
    }
  },
  mounted() {
    this.getNotice()
  },
  methods: {
    async getNotice() {
      this.loadingState = 0
      let noticeData = await FirebaseService.getNotice()
      let noticeCnt = noticeData.length
      this.notices = noticeData.slice(0, noticeCnt - 1)
      this.$store.state.lastNoticeIndex = Number(this.notices[0].noticeIdx)
      this.loadingState = 1
      this.$refs.form.inputs.forEach(function(component) {
        component.errorBucket = []
      })
    },
    async postNotice() {
      let vm = this
      const initialNoticeForm = function() {
        vm.getNotice()
        vm.dialog = false
        vm.title = null
        vm.body = null
        vm.imgFile = undefined
        vm.imgUrl = null
        vm.waitingMessage = ''
      }
      this.waitingMessage = '조금만 기다려주세요.'
      if (this.imgFile !== null && this.imgFile !== '' && this.imgFile !== undefined) {
        const formData = new FormData()
        const requestHeaders = {
          headers: {
            Authorization: process.env.VUE_APP_IMGUR_CLIENT_ID
          }
        }
        formData.append('image', this.imgFile)
        axios.post('https://api.imgur.com/3/image', formData, requestHeaders)
          .then(response => {
            this.imgUrl = response.data.data.link
            this.waitingMessage = '사진 업로드 중...'
            if (response.status === 200) {
              FirebaseService.postNotice(this.title, this.$store.state.user, this.$store.state.email, this.body, this.imgUrl)
              setTimeout(initialNoticeForm, 2000)
            }
          })
      } else {
        await FirebaseService.postNotice(this.title, this.$store.state.user, this.$store.state.email, this.body, '')
        setTimeout(initialNoticeForm, 500)
      }
    }
  },
  watch: {
    valid() {
      this.waitingMessage = this.valid ? "'작성' 버튼을 눌러주세요." : ''
    }
  }
}
</script>

<style scoped>
  .notice-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .notice-title .notice-title-body {
    font-weight: bold;
    font-size: 18px;
  }

  .notice-title .notice-title-body .fas::after {
    content: ' 공지사항';
    font-family: 'Yeon Sung';
  }

  .notice-title .notice-title-body span {
    font-family: 'Yeon Sung';
  }

  .notice-title .notice-add-icon {
    font-weight: bold;
    border-radius: 10px 10px;
    border: 1px solid lightgray;
    background-color: #F4F2DB;
    padding: 0 0.5rem;
  }

  .notice-title .notice-add-icon .fas::after {
    content: '공지 추가';
    font-family: 'Stylish';
  }

  .notice-add-dialog-title {
    font-size: 22px;
    font-family: 'Yeon Sung';
    font-weight: bold;
  }

  #notice-card {
    font-size: 15px;
    font-weight: 600;
    font-family: 'Poor Story';
    color: black;
  }

  .alert-section {
    font-size: 13px;
    font-family: 'Poor Story';
  }
</style>