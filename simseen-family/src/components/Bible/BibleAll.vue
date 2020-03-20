<template>
  <div class="ma-4">
    <div class="bible-title">
      <div class="bible-title-body">
        <i class="fas fa-bible"></i>
      </div>
      <div class="bible-add-icon" @click="goChurch()">
        <i class="fas fa-church"></i>
      </div>
    </div>
    <v-data-table
      :headers="tableHeaders"
      :items="allBible"
      :items-per-page="itemsPerPage"
      :page.sync="page"
      item-key="bibleIdx"
      hide-default-footer
      @page-count="pageCount = $event"
      @click:row="showBibleDetail($event)"
      class="elevation-1">
    </v-data-table>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="px-4 py-2 d-flex justify-space-between">
          <div class="bible-detail-title">{{ selectBible.position }}</div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="px-4 py-6" id="bible-card">
          <div class="bible-detail-body">{{ selectBible.body }}</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="px-4 py-3 bible-detail-buttons">
          <v-checkbox v-if="!selectStatus" v-model="checkbox" color="#F79F0F" class="py-0"></v-checkbox><span v-if="!selectStatus" class="bible-checkbox">금주의 성경암송으로</span>
          <v-btn v-if="!selectStatus" small color="#F79F0F" @click="changeBible(selectBible)" :disabled="!checkbox">변경</v-btn>
          <v-spacer></v-spacer>
          <div v-if="loadingStatus" class="waiting-message">조금만 기다려주세요.</div>
          <v-btn v-else small color="#E6CC00" @click="closeDialog">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="changeDialog" persistent>
      <v-card>
        <v-card-text class="px-4 pt-4 pb-2" id="notice-card">
          <p class="text-center" style="font-size: 100px;"><i class="fas fa-bible"></i></p>
          <p class="text-center mt-6 mb-4" style="font-size: 1.3em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;">금주 성경암송이 변경되었습니다.</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <span></span>
          <v-spacer></v-spacer>
          <v-btn small color="#E6CC00" @click="changeDialog = false">닫기</v-btn>
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
  data() {
    return {
      allBible: [],
      tableHeaders: [
        { text: '번호', value: 'bibleIdx' },
        { text: '성경', value: 'position' },
      ],
      page: 1,
      pageCount: 0,
      itemsPerPage: 4,
      selectBible: {},
      nowSelect: 0,
      dialog: false,
      changeDialog: false,
      selectStatus: false,
      checkbox: false,
      loadingStatus: 0
    }
  },
  created() {
    this.getBible()
  },
  methods: {
    async getBible() {
      let bibles = await FirebaseService.getBible()
      this.nowSelect = bibles.find(bible => bible.select)
      this.allBible = bibles
      this.pageCount = parseInt(bibles.length / 4 + 1)
    },
    showBibleDetail(bible) {
      this.selectBible = bible
      this.dialog = true
      this.selectStatus = bible.select
    },
    async changeBible(bible) {
      this.loadingStatus = 1
      await FirebaseService.changeBible(this.nowSelect, 0)
      await FirebaseService.changeBible(bible, 1)
      setTimeout(() => {
        this.getBible()
        this.closeDialog()
        this.changeDialog = true
        this.loadingStatus = 0
      }, 4000)
    },
    closeDialog() {
      this.selectBible = {}
      this.checkbox = false
      this.dialog = false
    },
    goChurch() {
      window.open('http://m.heavencc.net/', '_self')
    }
  },
  destroyed() {
    this.$store.state.clickBible = false
  }
}
</script>

<style scoped>
  .bible-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .bible-title .bible-title-body {
    font-weight: bold;
    font-size: 18px;
  }

  .bible-title .bible-title-body .fas::after {
    content: ' 전체 성경암송';
    font-family: 'Yeon Sung';
  }

  .bible-title .bible-add-icon {
    font-weight: bold;
    border-radius: 10px 10px;
    border: 1px solid lightgray;
    background-color: #F4F2DB;
    padding: 0 0.5rem;
  }

  .bible-title .bible-add-icon .fas::after {
    font-weight: bold;
    content: ' 하늘중앙교회';
    font-family: 'Stylish';
  }

  .bible-detail-title {
    font-family: 'Yeon Sung';
    font-weight: 600;
  }

  .bible-detail-user {
    font-family: 'Stylish';
    font-size: 0.8em;
  }

  .bible-detail-body {
    font-family: 'Poor Story';
    line-height: 24px;
    text-align: justify;
  }

  .bible-detail-buttons {
    font-family: 'Poor Story';
  }

  .bible-checkbox {
    font-size: 14px;
    margin-right: 8px;
    letter-spacing: -0.03em;
  }

  .waiting-message {
    font-family: 'Poor Story';
    font-size: 14px;
    letter-spacing: -0.06em;
  }
</style>