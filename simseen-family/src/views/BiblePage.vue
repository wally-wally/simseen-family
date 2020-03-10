<template>
  <div class="bible-wrapper">
    <BibleAll v-if="this.familyAuth" data-aos="fade-down" data-aos-duration="2000" data-aos-once="true"></BibleAll>
    <div v-else>
      <p class="text-center" style="font-size: 120px;"><i class="fas fa-home"></i></p>
      <p class="text-center" style="font-size: 1.3em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;">심슨패밀리 인증이 필요합니다.</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BibleAll from '@/components/BibleAll'

export default {
  name: 'BiblePage',
  components: {
    BibleAll
  },
  computed: {
    ...mapState(['familyAuth'])
  }
}
</script>

<style scoped>
  .bible-wrapper {
    margin: 4.5rem 0 1rem;
  }
</style>