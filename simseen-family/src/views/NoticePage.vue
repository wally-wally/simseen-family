<template>
  <div class="notice-wrapper">
    <Notice v-if="this.$store.state.familyAuth" data-aos="fade-down" data-aos-duration="2000" data-aos-once="true"></Notice>
    <RequireFamilyAuth v-else></RequireFamilyAuth>
  </div>
</template>

<script>
import Notice from '@/components/Notice/Notice'
import RequireFamilyAuth from '@/components/common/RequireFamilyAuth'

export default {
  name: 'NoticePage',
  components: {
    Notice,
    RequireFamilyAuth
  }
}
</script>

<style scoped>
  .notice-wrapper {
    margin: 4.5rem 0 1rem;
  }
</style>