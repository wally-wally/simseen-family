<template>
  <div class="bible-wrapper">
    <BibleAll v-if="this.familyAuth" data-aos="fade-down" data-aos-duration="2000" data-aos-once="true"></BibleAll>
    <RequireFamilyAuth v-else></RequireFamilyAuth>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BibleAll from '@/components/Bible/BibleAll'
import RequireFamilyAuth from '@/components/common/RequireFamilyAuth'

export default {
  name: 'BiblePage',
  components: {
    BibleAll,
    RequireFamilyAuth
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