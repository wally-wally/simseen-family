<template>
  <div class="content-wrapper">
    <Bible></Bible>
    <Dinner></Dinner>
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