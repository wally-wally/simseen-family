<template>
  <div style="font-family: 'Noto Sans KR';">
    <v-data-table
      :headers="tableHeaders"
      :items="notices"
      :items-per-page="itemsPerPage"
      :page.sync="page"
      item-key="created_at"
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
          <div class="notice-detail-user">by{{ selectNotice.user }}</div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-4" id="notice-card">
          <p class="text-center" v-if="selectNotice.imgUrl !== ''">
            <img :src="selectNotice.imgUrl" alt="notice-img" id="notice-img" style="margin-left: auto; margin-right: auto; display: block;">
          </p>
          <hr class="mb-2" v-if="selectNotice.imgUrl !== ''">
          <div class="notice-detail-body">{{ selectNotice.body }}</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <span></span>
          <v-spacer></v-spacer>
          <v-btn small color="error" v-if="selectNotice.userEmail === this.$store.state.email" @click="deleteNotice(selectNotice.noticeIdx)">삭제</v-btn>
          <v-btn small color="#E6CC00" @click="dialog = false">닫기</v-btn>
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
      itemsPerPage: 5,
      dialog: false,
      selectNotice: ''
    }
  },
  methods: {
    showNoticeDetail(notice) {
      this.selectNotice = notice
      this.dialog = true
    },
    async deleteNotice(index) {
      await FirebaseService.deleteNotice(index)
      this.dialog = false
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
  .notice-detail-title {
    font-family: 'Noto Sans KR';
    font-weight: 600;
    font-size: 0.9em;
  }

  .notice-detail-user {
    font-family: 'Nanum Gothic';
    font-size: 0.7em;
  }

  .notice-detail-body {
    font-size: 0.9em;
    line-height: 24px;
    text-align: justify;
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