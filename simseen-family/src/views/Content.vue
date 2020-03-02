<template>
  <div class="content-wrapper">
    <Bible data-aos="fade-down" data-aos-duration="2000" data-aos-once="true"></Bible>
    <Dinner data-aos="fade-down" data-aos-delay="1000" data-aos-duration="2000" data-aos-once="true"></Dinner>
  </div>
</template>

<script>
import Bible from '@/components/Bible'
import Dinner from '@/components/Dinner'

export default {
  name: 'Content',
  components: {
    Bible,
    Dinner
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
  .content-wrapper {
    margin: 4.5rem 0 1rem;
  }
</style>