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
            <v-card-text v-if="editState === 1 && imgUrls[0] !== ''" class="pa-0">
              <p class="text-center" v-if="!showImageInput">
                <img v-for="i in imgUrls.length" :key="i" :src="imgUrls[i - 1]" alt="notice-img" id="notice-img">
              </p>
            </v-card-text>
            <v-card-text class="pa-0">
              <div id="image-preview"></div>
            </v-card-text>
            <v-textarea
              v-model="body"
              label="내용"
              :counter="0"
              :rules="bodyRules"
              required></v-textarea>
            <v-file-input
              accept="image/*"
              name="photo"
              v-if="(editState === 1 && imgUrls[0] === '') || (showImageInput)"
              v-model="imgFiles"
              label="사진 첨부(선택)"
              id="photo"
              :rules="imgRules"
              :counter="3"
              multiple
              dense
              clearable
              @click:clear="imageReset"></v-file-input>
            <v-alert
              v-else
              text
              color="warning"
              class="pa-2"
              dense>
              <div class="reupload-image-alert">
                <v-chip
                  color="red"
                  text-color="white"
                  @click="clearImages">여기</v-chip>
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
          <v-btn small color="#E6CC00" @click="togglePostDialog()">닫기</v-btn>
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
        v => (v && v.length <= 15) || '최대 15자까지 작성 가능합니다.'
      ],
      body: null,
      bodyRules: [
        v => !!v || '내용을 작성하세요.',
        v => (v && v.length >= 5) || '최소 5자 이상 작성해야 합니다.'
      ],
      showImageInput: true,
      imgFiles: [],
      imgUrls: [],
      imgUploadTime: 0,
      imgRules: [
        v => (v.length <= 3) || '최대 3장까지 첨부할 수 있습니다.'
      ],
      waitingMessage: '',
      loadingState: 0,
      editState: 0,
      editNoticeInfo: '',
      postDialog: false,
      postAlert: '',
      checkImgUrlCount: 0
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
        vm.imgFiles = []
        vm.imgUrls = []
        vm.valid = true
        vm.waitingMessage = ''
        vm.dialog = false
        vm.postDialog = true
        vm.imgUploadTime = 0
        vm.getNotice()
      }
      this.waitingMessage = '조금만 기다려주세요.'
      this.postAlert = status === 'post' ? '게시' : '수정'
      if (this.imgFiles.length !== 0) {
        this.imgFiles.forEach(imgFile => {
          const formData = new FormData()
          formData.append('image', imgFile)
          let vm = this
          axios.post('https://api.imgur.com/3/image', formData, { headers: { Authorization: process.env.VUE_APP_IMGUR_CLIENT_ID } })
            .then(response => {
              vm.imgUrls.push(response.data.data.link)
              vm.waitingMessage = `사진 업로드 중`
              if (response.status === 200) return
          })
        })
        setTimeout(() => {
          let temp = 0
          if (this.imgUrls.length >= 1 && this.imgUrls[0] === '') {
            temp = 1
            this.checkImgUrlCount = this.imgUrls.length - 1
          } else {
            this.checkImgUrlCount = this.imgUrls.length
          }
          this.waitingMessage = '조금만 기다려주세요.'
          setTimeout(() => {
            if (this.imgFiles.length > 0 && this.checkImgUrlCount === this.imgFiles.length) {
              if (status === 'post') {
                FirebaseService.postNotice(this.title, this.$store.state.user, this.$store.state.email, this.body, temp ? this.imgUrls.slice(1, this.checkImgUrlCount + 1) : this.imgUrls)
              } else {
                FirebaseService.updateNotice(this.editNoticeInfo.noticeIdx, this.title, this.$store.state.user, this.$store.state.email, this.body, temp ? this.imgUrls.slice(1, this.checkImgUrlCount + 1) : this.imgUrls, this.editNoticeInfo.created_at)
              }
              this.waitingMessage = '조금만 기다려주세요.'
              setTimeout(initialNoticeForm, 2000)
            } else {
              this.imgUrls = []
              alert('전송 시간이 초과되었습니다. 인터넷 환경이 원활한 곳에서 다시 시도하세요.')
            }
          }, 3000 * (this.imgUploadTime + 1))
        }, 3000 * this.imgUploadTime)
      } else {
        let temp = 0
        if (this.imgUrls.length >= 2 && this.imgUrls[0] === '') {
          temp = 1
          this.checkImgUrlCount = this.imgUrls.length - 1
        } else {
          if (this.imgUrls === ['']) {
            this.checkImgUrlCount = 0
          } else {
            this.checkImgUrlCount = this.imgUrls.length
          }
        }
        if (this.imgUrls.length === 0) {
          this.imgUrls = ['']
        }
        if (status === 'post') {
          await FirebaseService.postNotice(this.title, this.$store.state.user, this.$store.state.email, this.body, temp ? this.imgUrls.slice(1, this.checkImgUrlCount + 1) : this.imgUrls)
        } else {
          await FirebaseService.updateNotice(this.editNoticeInfo.noticeIdx, this.title, this.$store.state.user, this.$store.state.email, this.body, temp ? this.imgUrls.slice(1, this.checkImgUrlCount + 1) : this.imgUrls, this.editNoticeInfo.created_at)
        }
        setTimeout(initialNoticeForm, 3000)
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
      if (this.imgUrls !== ['']) {
        this.showImageInput = false
        this.imgUrls = notice.imgUrl
      } else {
        this.imgFiles = []
        this.imgUrls = []
      }
      this.editNoticeInfo = {
        noticeIdx: notice.noticeIdx,
        created_at: notice.created_at
      }
      this.waitingMessage = this.valid ? "'수정' 버튼을 눌러주세요." : ''
    },
    clearImages() {
      this.showImageInput = true
      this.imgUrls = ['']
      this.imgUploadTime = 0
    },
    imageReset() {
      this.imgUploadTime = 0
      let imagePreview = document.querySelector('#image-preview')
      let tempImages = document.querySelectorAll('#img-center-wrapper')
      tempImages.forEach(tempImage => imagePreview.removeChild(tempImage))
    },
    togglePostDialog() {
      this.postDialog = false
      this.imageReset()
    },
    cancelNotice() {
      this.title = null
      this.body = null
      this.imgFiles = []
      this.imgUrls = []
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
      this.imageReset()
    }
  },
  watch: {
    valid() {
      if (this.editState === 0) {
        this.waitingMessage = this.valid ? "'작성' 버튼을 눌러주세요." : ''
      } else {
        this.waitingMessage = this.valid ? "'수정' 버튼을 눌러주세요." : ''
      }
    },
    imgFiles() {
      if (this.imgFiles.length === 0) {
        this.imageReset()
      } else {
        let preview = document.querySelector('#image-preview');
        if (this.imgFiles) {
          this.imgFiles.forEach(imgFile => {
            if (imgFile.size < 1000000) {
              this.imgUploadTime += 1
            } else {
              this.imgUploadTime += (parseInt(imgFile.size / 1000000)) + 1
            }
            let reader = new FileReader()
            reader.onload = event => {
              let imgWrapper = document.createElement('p')
              imgWrapper.setAttribute('class', 'text-center ma-0')
              imgWrapper.setAttribute('id', 'img-center-wrapper')
              let imgTag = document.createElement('img')
              imgTag.setAttribute('src', event.target.result)
              imgTag.setAttribute('style', 'display: block; margin: 0 auto; padding: 8px 0; width: 85%;')
              imgWrapper.appendChild(imgTag)
              preview.appendChild(imgWrapper)
            }
            reader.readAsDataURL(imgFile)
          })
        }
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
    letter-spacing: -0.05em;
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