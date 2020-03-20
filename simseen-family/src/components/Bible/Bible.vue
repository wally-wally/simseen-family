<template>
  <div class="ma-4">
    <div class="bible-title">
      <div class="bible-title-body">
        <i class="fas fa-bible"></i>
      </div>
      <div class="bible-all-icon" @click="goAllBible()" v-if="this.familyAuth">
        <i class="far fa-list-alt"></i>
      </div>
    </div>
    <div v-if="selectBible.length !== 0 && this.familyAuth" class="bible-content">
      <div class="bible-body">{{ selectBible.body }}</div>
      <div class="bible-position text-right">{{ selectBible.position }}</div>
    </div>
    <div v-else-if="selectBible.length !== 0 && !this.familyAuth" class="bible-content">
      <p class="text-center pa-2">
        <strong>심슨패밀리 인증이 필요합니다.</strong>
      </p>
    </div>
    <div v-else class="bible-content">
      <p class="text-center pa-2">
        <strong>데이터를 불러오는 중입니다.</strong>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import FirebaseService from '@/services/FirebaseService'

export default {
  name: 'Bible',
  data() {
    return {
      selectBible: []
    }
  },
  computed: {
    ...mapState(['familyAuth'])
  },
  created() {
    this.getBible()
  },
  methods: {
    async getBible() {
      let bibleContents = await FirebaseService.getBible()
      this.selectBible = bibleContents.find(bible => bible.select)
    },
    goAllBible() {
      this.$store.state.clickInit = false
      this.$store.state.clickBible = true
      this.$store.state.clickTitle = false
      this.$store.state.clickNotice = false
      this.$store.state.clickDinner = false
      this.$store.state.clickMemo = false
      this.$router.push('/bible')
    }
  }
}
</script>

<style scoped>
  .bible-title {
    display: flex;
    justify-content: space-between;
    margin: 8px 0;
  }

  .bible-title .bible-title-body {
    font-weight: bold;
    font-size: 18px;
  }

  .bible-title .bible-title-body .fas::after {
    content: ' 금주의 성경암송';
    font-family: 'Yeon Sung';
  }

  .bible-title .bible-all-icon {
    font-weight: bold;
    border-radius: 10px 10px;
    border: 1px solid lightgray;
    background-color: #F4F2DB;
    padding: 0 0.5rem;
  }

  .bible-title .bible-all-icon .far::after {
    font-weight: bold;
    content: '모든 성경 구절';
    font-family: 'Stylish';
  }

  .bible-content {
    background-color: #F4F2DB;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.05);
  }

  .bible-content .bible-body,
  .bible-content p {
    border-bottom: 1px solid #E9D644;
    padding: 8px;
    font-size: 14px;
    font-family: 'Nanum Gothic';
    line-height: 1.7em;
    letter-spacing: 0.5px;
    text-align: justify;
  }

  .bible-content .bible-position {
    border-top: 1px solid #E9D644;
    padding: 8px;
    font-size: 12px;
  }
</style>