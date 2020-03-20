<template>
  <div class="memo-wrapper">
    <div v-if="this.familyAuth">
      <TodoList data-aos="fade-down" data-aos-duration="2000" data-aos-once="true"></TodoList>
      <hr class="mx-4 mb-5" color="lightgray" data-aos="fade-down" data-aos-duration="2000" data-aos-once="true">
      <Memo data-aos="fade-down" data-aos-delay="1000" data-aos-duration="2000" data-aos-once="true"></Memo>
    </div>
    <RequireFamilyAuth v-else></RequireFamilyAuth>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TodoList from '@/components/TodoMemo/TodoList'
import Memo from '@/components/TodoMemo/Memo'
import RequireFamilyAuth from '@/components/common/RequireFamilyAuth'

export default {
  name: 'MemoPage',
  components: {
    TodoList,
    Memo,
    RequireFamilyAuth
  },
  computed: {
    ...mapState(['familyAuth'])
  }
}
</script>

<style scoped>
  .memo-wrapper {
    margin: 4.5rem 0 1rem;
  }
</style>