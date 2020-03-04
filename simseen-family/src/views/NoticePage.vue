<template>
  <div class="notice-wrapper">
    <Notice v-if="this.$store.state.familyAuth" data-aos="fade-down" data-aos-duration="2000" data-aos-once="true"></Notice>
    <div v-else>
      <p class="text-center" style="font-size: 120px;"><i class="fas fa-home"></i></p>
      <p class="text-center" style="font-size: 1.3em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;">심슨패밀리 인증이 필요합니다.</p>
    </div>
  </div>
</template>

<script>
import Notice from '@/components/Notice'
export default {
  name: 'NoticePage',
  components: {
    Notice
  }
}
</script>

<style scoped>
  .notice-wrapper {
    margin: 4.5rem 0 1rem;
  }
</style>