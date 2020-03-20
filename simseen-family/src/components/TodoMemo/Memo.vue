<template>
  <div class="ma-4">
    <div class="memo-title">
      <div class="memo-title-body">
        <i class="fas fa-sticky-note"></i>
      </div>
      <div style="line-height: 27px;">
        <span v-if="this.$store.state.tempMemo.length" class="memo-temp-icon mr-1" @click="tempDialog = true">
          <i class="fas fa-box"></i>
        </span>
        <span class="memo-delete-icon mr-1" @click="resetMemo(0)">
          <i class="fas fa-eraser"></i>
        </span>
        <span class="memo-reset-icon" @click="resetMemo(1)">
          <i class="fas fa-undo"></i>
        </span>
      </div>
    </div>
    <v-textarea
      v-model="memo"
      placeholder="메모를 작성하세요."
      :counter="0"
      color="#E6CC00"
      outlined
      auto-grow
      required
      class="memo-textarea"
      :style="{ fontFamily: 'Poor Story' }"></v-textarea>
    <transition name="fade">
      <v-alert
        v-if="tempAlert"
        outlined
        dense
        text
        type="warning"
        border="left"
        :style="{ fontFamily: 'Poor Story', fontSize: '14px' }">
        <div>20자 이상 작성하는 경우에 자동으로 임시보관함에 저장됩니다. <strong>(단, 로그아웃 하는 경우 임시보관함에 저장된 메모가 없어집니다.)</strong></div>
      </v-alert>
    </transition>
    <v-card-actions class="py-2 px-0" :style="{ fontFamily: 'Poor Story', fontSize: '14px' }">
      <span class="alert-section">메모를 등록하려면 최소 1자 이상 작성하세요.</span>
      <v-spacer></v-spacer>
      <v-btn rounded color="error" dark @click="postMemoDialog()" :disabled="!memo.length ? true : false">메모 등록</v-btn>
    </v-card-actions>
    <v-dialog v-model="postDialog" persistent>
      <v-card v-if="!postComplete">
        <v-card-text class="px-4 pt-4 pb-2" id="notice-card">
          <p class="text-center" style="font-size: 120px;"><i class="fas fa-sticky-note"></i></p>
          <p class="text-center" style="font-size: 1.2em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600; letter-spacing: -0.02em;">작성한 메모로 변경 및 등록하시겠습니까?</p>
          <p class="text-center" style="font-size: 0.9em; font-family: 'Noto Sans KR'">(하단 <span style="color: #FF5252;">'등록'</span> 버튼을 누르면 진행됩니다.)</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4" :style="{ fontFamily: 'Poor Story' }">
          <span></span>
          <v-spacer></v-spacer>
          <v-btn small color="error" @click="postMemo()">등록</v-btn>
          <v-btn small color="#E6CC00" @click="postDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-text class="px-4 pt-4 pb-2" id="notice-card">
          <p class="text-center" style="font-size: 120px;"><i class="fas fa-plus"></i></p>
          <p class="text-center" style="font-size: 1.2em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600; letter-spacing: -0.02em;">메모가 등록 및 변경되었습니다.</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4" :style="{ fontFamily: 'Poor Story' }">
          <span></span>
          <v-spacer></v-spacer>
          <v-btn small color="#E6CC00" @click="postDialog = false; postComplete = 0">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="resetDialog" persistent>
      <v-card>
        <v-card-text class="px-4 pt-4 pb-2" id="notice-card">
          <p class="text-center" style="font-size: 100px;"><i :class="this.resetStatus ? 'fas fa-undo' : 'fas fa-eraser'"></i></p>
          <p class="text-center" style="font-size: 1.2em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600; letter-spacing: -0.02em;" v-if="!resetStatus">현재 작성한 메모를 전부 지우시겠습니까?</p>
          <p class="text-center" style="font-size: 1.2em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;" v-else>메모를 원래대로 복구하시겠습니까?</p>
          <p class="text-center" style="font-size: 0.9em; font-family: 'Noto Sans KR'">(하단 <span style="color: #FF5252;">'진행'</span> 버튼을 누르면 진행됩니다.)</p>
          <v-alert
            class="pa-2"
            text
            outlined
            color="deep-orange"
            :style="{ fontFamily: 'Poor Story', fontSize: '14px' }">
          <div class="d-flex">
            <div class="mr-1">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="ml-1">
              <p class="mb-1">지금 메모 내용을 복구 또는 삭제해도 실제 데이터베이스의 내용은 변경되지 않습니다.</p>
              <p class="mb-0">메모 내용을 작성한 후 메모 작성란 하단의 <span style="color: #FF5252; font-weight: bold; text-decoration: underline;">'메모 등록'</span> 버튼을 눌러야 변경됩니다.</p>
            </div>
          </div>
          </v-alert>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4" :style="{ fontFamily: 'Poor Story' }">
          <span></span>
          <v-spacer></v-spacer>
          <v-btn small color="error" @click="runReset()">진행</v-btn>
          <v-btn small color="#E6CC00" @click="resetDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="tempDialog" persistent>
      <v-card>
        <v-card-text class="px-4 pt-4 pb-2" id="notice-card">
          <p class="text-center" style="font-size: 100px;"><i class="fas fa-box"></i></p>
          <p class="text-center mb-0" style="font-size: 1.2em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;">임시보관함에 저장된</p>
          <p class="text-center" style="font-size: 1.2em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;">메모를 불러오시겠습니까?</p>
          <p class="text-center" style="font-size: 0.9em; font-family: 'Noto Sans KR'">(하단 <span style="color: #FF5252;">'불러오기'</span> 버튼을 누르면 진행됩니다.)</p>
          <v-alert
            class="pa-2"
            text
            outlined
            color="deep-orange"
            :style="{ fontFamily: 'Poor Story', fontSize: '14px' }">
          <div class="d-flex">
            <div class="mr-1">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="ml-1">
              <p class="mb-1">임시보관함의 메모를 불러와도 실제 데이터베이스의 내용은 변경되지 않습니다.</p>
              <p class="mb-0">메모 내용을 작성한 후 메모 작성란 하단의 <span style="color: #FF5252; font-weight: bold; text-decoration: underline;">'메모 등록'</span> 버튼을 눌러야 변경됩니다.</p>
            </div>
          </div>
          </v-alert>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4" :style="{ fontFamily: 'Poor Story' }">
          <span></span>
          <v-spacer></v-spacer>
          <v-btn small color="error" @click="loadTemp()">불러오기</v-btn>
          <v-btn small color="#E6CC00" @click="tempDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FirebaseService from '@/services/FirebaseService'

export default {
  name: 'Memo',
  data() {
    return {
      originalMemo: '',
      memo: '',
      userEmail: this.$store.state.email.split('@')[0],
      resetStatus: 0,
      resetDialog: false,
      postDialog: false,
      tempDialog: false,
      postComplete: 0,
      tempAlert: 0
    }
  },
  created() {
    this.getMemo()
  },
  methods: {
    async getMemo() {
      this.memo = await FirebaseService.getMemo(this.userEmail)
      this.originalMemo = this.memo
    },
    async postMemo() {
      await FirebaseService.postMemo(this.userEmail, this.memo)
      this.postComplete = 1
      this.originalMemo = this.memo
    },
    postMemoDialog() {
      this.postDialog = true
    },
    resetMemo(status) {
      this.resetDialog = true
      this.resetStatus = status
    },
    runReset() {
      this.memo = this.resetStatus ? this.originalMemo : ''
      this.resetDialog = false
    },
    loadTemp() {
      this.memo = this.$store.state.tempMemo
      this.tempDialog = false
    }
  },
  beforeDestroy() {
    if (this.memo.length >= 20) {
      this.$store.state.tempMemo = this.memo
    }
  },
  watch: {
    memo() {
      this.tempAlert = this.memo.length >= 20 ? 1 : 0
    }
  }
}
</script>

<style scoped>
  .memo-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .memo-title .memo-title-body {
    font-weight: bold;
    font-size: 18px;
  }

  .memo-title .memo-title-body .fas::after {
    content: ' 메모';
    font-family: 'Yeon Sung';
  }

  .memo-title .memo-title-body span {
    font-family: 'Yeon Sung';
  }

  .memo-title .memo-temp-icon {
    font-size: 15px;
    font-weight: bold;
    border-radius: 10px 10px;
    border: 1px solid lightgray;
    background-color: #FAEDE0;
    padding: 0 0.5rem;
  }

  .memo-title .memo-reset-icon {
    font-size: 15px;
    font-weight: bold;
    border-radius: 10px 10px;
    border: 1px solid lightgray;
    background-color: #F4F2DB;
    padding: 0 0.5rem;
  }

  .memo-title .memo-delete-icon {
    font-size: 15px;
    font-weight: bold;
    border-radius: 10px 10px;
    border: 1px solid lightgray;
    background-color: #FBD2D0;
    padding: 0 0.5rem;
  }

  .memo-title .memo-temp-icon .fas::after {
    content: '임시메모';
    font-family: 'Stylish';
  }

  .memo-title .memo-delete-icon .fas::after {
    content: '전체 삭제';
    font-family: 'Stylish';
  }

  .memo-title .memo-reset-icon .fas::after {
    content: '원래대로';
    font-family: 'Stylish';
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .8s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>