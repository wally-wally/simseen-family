<template>
  <div class="dinner-wrapper">
    <router-view v-if="this.familyAuth" data-aos="fade-down" data-aos-duration="2000" data-aos-once="true"></router-view>
    <RequireFamilyAuth v-else data-aos="fade-down" data-aos-duration="2000" data-aos-once="true"></RequireFamilyAuth>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RequireFamilyAuth from '@/components/common/RequireFamilyAuth'

export default {
  name: 'DinnerPage',
  components: {
    RequireFamilyAuth
  },
  computed: {
    ...mapState(['familyAuth'])
  }
}
</script>

<style scoped>
  .dinner-wrapper {
    margin: 4.5rem 0 1rem;
  }
</style>