<template>
  <div class="notice-main-content">
    <div class="notice-main-header d-flex justify-space-between">
      <div class="notice-main-title">{{ notices[0].title }}</div>
      <div class="notice-main-user">by {{ notices[0].user }}</div>
    </div>
    <div class="notice-main-body">
      <p class="text-center" v-if="notices[0].imgUrl !== ''">
        <img :src="notices[0].imgUrl" class="d-block" alt="notice-img" id="notice-img">
      </p>
      {{ notices[0].body }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoticeMain',
  props: ['notices']
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

  @media (orientation: portrait) {
    p > img[id="notice-img"] {
      margin: 0 auto;
      width: 80%;
    }
  }

  @media (orientation: landscape) {
    p > img[id="notice-img"] {
      margin: 0 auto;
      width: 60%;
    }
  }
</style>