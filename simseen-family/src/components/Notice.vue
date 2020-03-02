<template>
  <div class="ma-4">
    <div class="notice-title">
      <div class="notice-title-body">
        <i class="fas fa-clipboard-list"></i>
      </div>
      <div class="notice-add-icon">
        <i class="fas fa-plus"></i>
      </div>
    </div>
    <NoticeMain v-if="this.$route.name === 'main'"></NoticeMain>
    <NoticeTable v-else></NoticeTable>
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
  mounted() {
    this.getNotice()
  },
  methods: {
    async getNotice() {
      this.$store.state.notices = await FirebaseService.getNotice()
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
</style>