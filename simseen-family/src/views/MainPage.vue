<template>
  <div class="main-wrapper">
    <Bible data-aos="fade-down" data-aos-duration="2000" data-aos-once="true"></Bible>
    <Notice data-aos="fade-down" data-aos-delay="1000" data-aos-duration="2000" data-aos-once="true"></Notice>
    <Dinner data-aos="fade-down" data-aos-delay="2000" data-aos-duration="2000" data-aos-once="true"></Dinner>
  </div>
</template>

<script>
import Notice from '@/components/Notice/Notice'
import Bible from '@/components/Bible/Bible'
import Dinner from '@/components/Dinner/Dinner'

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