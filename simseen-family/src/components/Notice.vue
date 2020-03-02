<template>
  <div class="ma-4">
    <div class="notice-title">
      <div class="notice-title-body">
        <i class="fas fa-clipboard-list"></i>
      </div>
      <div class="notice-add-icon" @click="dialog = true">
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
              :counter="20"
              :rules="titleRules"
              required></v-text-field>
            <v-select
              v-model="user"
              :items="users"
              label="작성자"
              :rules="[v => !!v || '이름을 선택하세요.']"
              dense></v-select>
            <v-textarea
              v-model="body"
              :counter="0"
              :rules="bodyRules"
              required
              label="내용"></v-textarea>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="#E6CC00" :disabled="!valid" @click="postNotice()">작성</v-btn>
              <v-btn small color="error" @click="dialog = false">취소</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <NoticeMain v-if="this.$route.name === 'main'" :notices="notices"></NoticeMain>
    <NoticeTable v-else :notices="notices"></NoticeTable>
  </div>
</template>

<script>
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
        v => (v && v.length <= 20) || '최대 20자까지 작성 가능합니다.'
      ],
      user: '',
      users: ['심의진', '김영숙', '심규현', '심예은'],
      body: '',
      bodyRules: [
        v => !!v || '내용을 작성하세요.',
        v => (v && v.length >= 20) || '최소 20자 이상 작성해야 합니다.'
      ]
    }
  },
  mounted() {
    this.getNotice()
  },
  methods: {
    async getNotice() {
      this.notices = await FirebaseService.getNotice()
    },
    async postNotice() {
      await FirebaseService.postNotice(this.title, this.user, this.body)
      this.$router.go('/')
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
    content: '공지사항';
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
</style>