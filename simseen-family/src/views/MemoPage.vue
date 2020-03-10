<template>
  <div class="notice-wrapper">
    <TodoList v-if="this.familyAuth" data-aos="fade-down" data-aos-duration="2000" data-aos-once="true"></TodoList>
    <Memo v-if="this.familyAuth" data-aos="fade-down" data-aos-duration="2000" data-aos-once="true"></Memo>
    <div v-else>
      <p class="text-center" style="font-size: 120px;"><i class="fas fa-home"></i></p>
      <p class="text-center" style="font-size: 1.3em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;">심슨패밀리 인증이 필요합니다.</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TodoList from '@/components/TodoList'
import Memo from '@/components/Memo'

export default {
  name: 'NoticePage',
  components: {
    TodoList,
    Memo
  },
  computed: {
    ...mapState(['familyAuth'])
  }
}
</script>

<style scoped>
  .notice-wrapper {
    margin: 4.5rem 0 1rem;
  }
</style>