<template>
  <div class="main-wrapper">
    <Notice data-aos="fade-down" data-aos-duration="2000" data-aos-once="true"></Notice>
    <Bible data-aos="fade-down" data-aos-delay="1000" data-aos-duration="2000" data-aos-once="true"></Bible>
    <Dinner data-aos="fade-down" data-aos-delay="2000" data-aos-duration="2000" data-aos-once="true"></Dinner>
  </div>
</template>

<script>
import Notice from '@/components/Notice'
import Bible from '@/components/Bible'
import Dinner from '@/components/Dinner'

export default {
  name: 'Content',
  components: {
    Notice,
    Bible,
    Dinner
  }
}
</script>

<style scoped>
  .main-wrapper {
    margin: 4.5rem 0 1rem;
  }
</style>