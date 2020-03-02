<template>
  <div class="notice-wrapper">
    <Notice data-aos="fade-down" data-aos-duration="2000" data-aos-once="true"></Notice>
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