<template>
  <div class="notice-main-content">
    <div class="notice-main-header d-flex justify-space-between">
      <div class="notice-main-title">{{ recentlyNotice.title }}</div>
      <div class="notice-main-user">by {{ recentlyNotice.user }}</div>
    </div>
    <div class="notice-main-body">{{ recentlyNotice.body }}</div>
  </div>
</template>

<script>
export default {
  name: 'NoticeMain',
  data() {
    return  {
      recentlyNotice: this.$store.state.notices[0]
    }
  }
}
</script>

<style scoped>
  .notice-main-content {
    background-color: #F4F2DB;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.05);
    font-family: 'Nanum Gothic';
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
</style>