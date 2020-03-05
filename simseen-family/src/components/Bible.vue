<template>
  <div class="ma-4">
    <div class="bible-title">
      <i class="fas fa-bible"></i>
    </div>
    <div v-if="thisWeekBible.length !== 0" class="bible-content">
      <div class="bible-body">{{ thisWeekBible.body }}</div>
      <div class="bible-position text-right">{{ thisWeekBible.position }}</div>
    </div>
    <div v-else class="bible-content">
      <p class="text-center pa-2">
        <strong v-if="loadingState === 1">등록된 성경구절이 없습니다.</strong>
        <strong v-else>데이터를 불러오는 중입니다.</strong>
      </p>
    </div>
  </div>
</template>

<script>
import FirebaseService from '@/services/FirebaseService'

export default {
  name: 'Bible',
  data() {
    return {
      thisWeekBible: [],
      loadingState: 0
    }
  },
  mounted() {
    this.getBible()
  },
  methods: {
    async getBible() {
      let bibleContents = await FirebaseService.getBible()
      for (let i = 0; i < bibleContents.length; i++) {
        let dayObj = {
          componentName: 'Bible',
          checkDate: bibleContents[i].date.toLocaleDateString()
        }
        this.$store.commit('convertDateValue', dayObj)
        let todayValue = this.$store.getters.todayValue[0]
        let checkDayValue = this.$store.state.bibleCheckDayValue
        if (0 <= checkDayValue - todayValue && checkDayValue - todayValue < 7) {
          this.thisWeekBible = bibleContents[i]
          break
        }
      }
      this.loadingState = 1
    }
  }
}
</script>

<style scoped>
  .bible-title {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 8px;
  }

  .bible-title .fas::after {
    content: ' 금주의 성경암송';
    font-family: 'Yeon Sung';
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