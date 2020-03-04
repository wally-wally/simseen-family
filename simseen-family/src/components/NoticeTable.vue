<template>
  <div style="font-family: 'Noto Sans KR';">
    <v-data-table
      :headers="tableHeaders"
      :items="notices"
      :items-per-page="itemsPerPage"
      :page.sync="page"
      item-key="noticeIdx"
      hide-default-footer
      @page-count="pageCount = $event"
      @click:row="showNoticeDetail($event)"
      class="elevation-1">
      <!-- <template v-slot:expanded-item="{ headers, item }">
        <tr ></tr> -->
        <!-- <td class="pa-4" :colspan="headers.length">
          <p class="text-center" v-if="item.imgUrl !== ''">
            <img :src="item.imgUrl" alt="notice-img" id="notice-img" style="margin-left: auto; margin-right: auto; display: block;">
          </p>
          <hr v-if="item.imgUrl !== ''">
          <div class="mt-2" style="line-height: 24px;">{{ item.body }}</div>
        </td> -->
      <!-- </template> -->
    </v-data-table>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="pa-4 d-flex justify-space-between">
          <div class="notice-detail-title">{{ selectNotice.title }}</div>
          <div class="notice-detail-user">by {{ selectNotice.user }}</div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-4" id="notice-card">
          <p class="text-center" v-if="selectNotice.imgUrl !== ''">
            <img :src="selectNotice.imgUrl" alt="notice-img" id="notice-img" style="margin-left: auto; margin-right: auto; display: block;">
          </p>
          <hr class="mb-2" v-if="selectNotice.imgUrl !== ''">
          <div class="notice-detail-body" v-html="selectNoticeBody"></div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4 notice-detail-buttons">
          <span></span>
          <v-spacer></v-spacer>
          <v-btn small color="#F79F0F" v-if="selectNotice.userEmail === this.$store.state.email" @click="editNoticeDialog(selectNotice)">수정</v-btn>
          <v-btn small color="error" v-if="selectNotice.userEmail === this.$store.state.email" @click="deleteDialog = true">삭제</v-btn>
          <v-btn small color="#E6CC00" @click="dialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog" persistent>
      <v-card>
        <v-card-text class="px-4 pt-4 pb-2" id="notice-card">
          <p class="text-center" style="font-size: 100px;"><i class="fas fa-trash-alt"></i></p>
          <p class="text-center mt-6 mb-4" style="font-size: 1.3em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;">해당 공지를 삭제하시겠습니까?</p>
          <p class="text-center" style="font-size: 0.9em; font-family: 'Noto Sans KR'">(하단 <span style="color: #FF5252;">'삭제'</span> 버튼을 누르면 삭제됩니다.)</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <span></span>
          <v-spacer></v-spacer>
          <v-btn small color="error" @click="deleteNotice(selectNotice.noticeIdx)">삭제</v-btn>
          <v-btn small color="#E6CC00" @click="deleteDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount" :total-visible="7" circle color="#E6CC00"></v-pagination>
    </div>
  </div>
</template>

<script>
import FirebaseService from '@/services/FirebaseService'

export default {
  name: 'NoticeTable',
  props: ['notices'],
  data() {
    return {
      tableHeaders: [
        { text: '제목', value: 'title' },
        { text: '작성자', value: 'user' },
      ],
      page: 1,
      pageCount: parseInt(this.notices.length / 5),
      itemsPerPage: 4,
      dialog: false,
      deleteDialog: false,
      selectNotice: '',
      selectNoticeBody: ''
    }
  },
  methods: {
    showNoticeDetail(notice) {
      this.selectNotice = notice
      this.selectNoticeBody = notice.body.split('\n').join('<br />')
      this.dialog = true
    },
    editNoticeDialog(notice) {
      this.dialog = false
      this.$emit('editNotice', notice)
    },
    async deleteNotice(index) {
      await FirebaseService.deleteNotice(index)
      this.dialog = false
      this.deleteDialog = false
      this.$emit('getNotice')
    }
  }
}
</script>

<style scoped>
  .notice-detail-title {
    font-family: 'Yeon Sung';
    font-weight: 600;
  }

  .notice-detail-user {
    font-family: 'Stylish';
    font-size: 0.8em;
  }

  .notice-detail-body {
    font-family: 'Poor Story';
    line-height: 24px;
    text-align: justify;
  }

  .notice-detail-buttons {
    font-family: 'Poor Story';
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