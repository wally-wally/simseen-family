<template>
  <div class="dinner-wrapper">
    <Dinner v-if="this.$store.state.familyAuth" data-aos="fade-down" data-aos-duration="2000" data-aos-once="true"></Dinner>
    <div v-else>
      <p class="text-center" style="font-size: 120px;"><i class="fas fa-home"></i></p>
      <p class="text-center" style="font-size: 1.3em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;">심슨패밀리 인증이 필요합니다.</p>
    </div>
  </div>
</template>

<script>
import Dinner from '@/components/Dinner'

export default {
  name: 'DinnerPage',
  components: {
    Dinner
  }
}
</script>

<style scoped>
  .dinner-wrapper {
    margin: 4.5rem 0 1rem;
  }
</style>