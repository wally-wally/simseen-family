<template>
  <div class="ma-4">
    <div class="memo-title">
      <i class="fas fa-sticky-note"></i>
    </div>
  </div>
</template>

<script>
import FirebaseService from '@/services/FirebaseService'

export default {
  name: 'Memo',
  data() {
    return {
      memo: '',
      userEmail: this.$store.state.email.split('@')[0]
    }
  },
  created() {
    this.getMemo()
  },
  methods: {
    async getMemo() {
      this.memo = await FirebaseService.getMemo(this.userEmail)
    }
  }
}
</script>

<style scoped>
  .memo-title {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 8px;
  }

  .memo-title .fas::after {
    content: ' 메모';
    font-family: 'Yeon Sung';
  }
</style>