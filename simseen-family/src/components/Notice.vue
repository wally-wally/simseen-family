<template>
  <div class="ma-4">
    <div class="notice-title">
      <div class="notice-title-body">
        <i class="fas fa-clipboard-list"><span v-if="this.$route.name === 'main'"> 최근</span></i>
      </div>
      <div class="notice-add-icon" @click="addNotice()" v-if="this.$store.state.familyAuth">
        <i class="fas fa-plus"></i>
      </div>
    </div>
    <v-dialog v-model="dialog" persistent>
      <v-card>
        <v-card-title>
          <span v-if="editState" class="notice-add-dialog-title">공지 수정</span>
          <span v-else class="notice-add-dialog-title">공지 추가</span>
        </v-card-title>
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
            <v-card-text v-if="editState === 1 && imgUrl !== null && imgUrl !== ''" class=pa-0>
              <p class="text-center" v-if="!showImageInput">
                <img :src="imgUrl" alt="notice-img" id="notice-img">
              </p>
            </v-card-text>
            <v-textarea
              v-model="body"
              label="내용"
              :counter="0"
              :rules="bodyRules"
              required></v-textarea>
            <v-file-input
              accept="image/*;capture=camera"
              name="photo"
              v-if="(editState === 1 && (imgUrl === null || imgUrl === '')) || (showImageInput)"
              v-model="imgFile"
              label="사진 첨부(선택)"
              dense
              clearable></v-file-input>
            <v-alert
              v-else
              text
              color="warning"
              dense>
              <div class="reupload-image-alert">
                <v-chip
                  class="pa-2"
                  color="red"
                  text-color="white"
                  @click="showImageInput = true; imgUrl = ''">여기</v-chip>
              </div>
            </v-alert>
            <v-card-actions>
              <span class="alert-section">{{ waitingMessage }}</span>
              <v-spacer></v-spacer>
              <v-btn small color="#F79F0F" :disabled="!valid" v-if="editState" @click="postNotice('update')">수정</v-btn>
              <v-btn small color="#E6CC00" :disabled="!valid" v-else @click="postNotice('post')">작성</v-btn>
              <v-btn small color="error" @click="cancelNotice()">취소</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="postDialog" persistent>
      <v-card>
        <v-card-text class="px-4 pt-4 pb-2" id="notice-card">
          <p class="text-center" style="font-size: 100px;">
            <i v-if="editState === 0" class="fas fa-plus"></i>
            <i v-else class="fas fa-edit"></i>
          </p>
          <p class="text-center mt-6 mb-4" style="font-size: 1.4em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;">{{ postAlert }} 완료!</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <span></span>
          <v-spacer></v-spacer>
          <v-btn small color="#E6CC00" @click="postDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <NoticeMain v-if="this.$route.name === 'main'" :notice="notices[0]" :loadingState="loadingState"></NoticeMain>
    <NoticeTable v-else :notices="notices" @getNotice="getNotice" @editNotice="editNotice"></NoticeTable>
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
      title: null,
      titleRules: [
        v => !!v || '제목을 작성하세요.',
        v => (v && v.length <= 10) || '최대 10자까지 작성 가능합니다.'
      ],
      body: null,
      bodyRules: [
        v => !!v || '내용을 작성하세요.',
        v => (v && v.length >= 10) || '최소 10자 이상 작성해야 합니다.'
      ],
      showImageInput: true,
      imgFile: undefined,
      imgUrl: null,
      waitingMessage: '',
      loadingState: 0,
      editState: 0,
      editNoticeInfo: '',
      postDialog: false,
      postAlert: ''
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
      try {
        this.$refs.form.inputs.forEach(function(component) {
          component.hasFocused = false
          component.hasInput = false
        })
      } catch (error) { error }
    },
    async postNotice(status) {
      let vm = this
      const initialNoticeForm = function() {
        vm.title = null
        vm.body = null
        vm.imgFile = undefined
        vm.imgUrl = null
        vm.getNotice()
        vm.valid = true
        vm.waitingMessage = ''
        vm.dialog = false
        vm.postDialog = true
      }
      this.waitingMessage = '조금만 기다려주세요.'
      this.postAlert = status === 'post' ? '게시' : '수정'
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
            console.log(status)
            this.imgUrl = response.data.data.link
            this.waitingMessage = '사진 업로드 중...'
            if (response.status === 200) {
              if (status === 'post') {
                FirebaseService.postNotice(this.title, this.$store.state.user, this.$store.state.email, this.body, this.imgUrl)
              } else {
                FirebaseService.updateNotice(this.editNoticeInfo.noticeIdx, this.title, this.$store.state.user, this.$store.state.email, this.body, this.imgUrl, this.editNoticeInfo.created_at)
              }
              setTimeout(initialNoticeForm, 2000)
            }
          })
      } else {
        if (status === 'post') {
          await FirebaseService.postNotice(this.title, this.$store.state.user, this.$store.state.email, this.body, '')
        } else {
          await FirebaseService.updateNotice(this.editNoticeInfo.noticeIdx, this.title, this.$store.state.user, this.$store.state.email, this.body, this.imgUrl, this.editNoticeInfo.created_at)
        }
        setTimeout(initialNoticeForm, 500)
      }
    },
    addNotice() {
      this.dialog = true
      this.editState = 0
      this.showImageInput = true
    },
    editNotice(notice) {
      this.editState = 1
      this.dialog = true
      this.title = notice.title
      this.body = notice.body
      if (this.imgUrl !== '') {
        this.showImageInput = false
        this.imgUrl = notice.imgUrl
      } else {
        this.imgFile = undefined
        this.imgUrl = null
      }
      this.editNoticeInfo = {
        noticeIdx: notice.noticeIdx,
        created_at: notice.created_at
      }
      this.waitingMessage = this.valid ? "'수정' 버튼을 눌러주세요." : ''
    },
    cancelNotice() {
      this.title = null
      this.body = null
      this.imgFile = undefined
      this.imgUrl = null
      this.valid = false
      this.waitingMessage = ''
      try {
        this.$refs.form.inputs.forEach(function(component) {
          component.hasFocused = false
          component.hasInput = false
          component.isFocused = false
          component.initialValue = null
        })
      } catch (error) { 
        console.log(error)
      }
      this.getNotice()
      this.dialog = false
    }
  },
  watch: {
    valid() {
      if (this.editState === 0) {
        this.waitingMessage = this.valid ? "'작성' 버튼을 눌러주세요." : ''
      } else {
        this.waitingMessage = this.valid ? "'수정' 버튼을 눌러주세요." : ''
      }
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

  .reupload-image-alert {
    font-size: 0.8em;
  }

  .reupload-image-alert::after {
    content: '를 누르면 사진을 새로 재등록 할 수 있습니다.';
    letter-spacing: -0.03em;
  }

  @media (orientation: portrait) {
    p > img[id="notice-img"] {
      display: block;
      margin: 0 auto;
      width: 90%;
    }
  }

  @media (orientation: landscape) {
    p > img[id="notice-img"] {
      display: block;
      margin: 0 auto;
      width: 70%;
    }
  }
</style>