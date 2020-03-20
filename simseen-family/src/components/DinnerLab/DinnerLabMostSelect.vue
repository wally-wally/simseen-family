<template>
  <div>
    <v-alert
      dense
      text
      type="info"
      color="#FCA241"
      :style="{ fontFamily: 'Poor Story' }">
      <span>설정한 기간 동안 식단표에 가장 많이 등록된 메뉴들부터 차례대로 보여집니다.(단, 기본 메뉴(밥, 김치)는 제외)</span>
    </v-alert>
    <v-date-picker
      ref="form"
      v-model="dates"
      full-width
      :landscape="$vuetify.breakpoint.sm"
      locale="ko"
      color="#E6CC00"
      range
      :style="{ fontFamily: 'Noto Sans KR' }">
    </v-date-picker>
    <v-text-field v-model="dateRangeText" label="Date range" readonly class="mt-4" :style="{ fontFamily: 'Poor Story' }"></v-text-field>
    <div class="analysis-btn-wrapper">
      <div :class="this.sendAnalysis ? 'alert-message' : ''">{{ message }}</div>
      <v-btn v-if="!sendAnalysis" small color="error" :disabled="dates.length === 2 ? false : true" @click="sendData">분석</v-btn>
    </div>
    <v-dialog v-model="tryAgainDialog" persistent>
      <v-card>
        <v-card-text class="px-4 pt-4 pb-2" id="try-again-card">
          <p class="text-center" style="font-size: 100px;">
            <i class="fas fa-exclamation-triangle"></i>
          </p>
          <p class="text-center mt-6 mb-2" style="font-size: 1.4em; font-family: 'Poor Story', sans-serif; font-weight: 600;">아래의 날짜 범위 내에서만</p>
          <p class="text-center mb-4" style="font-size: 1.4em; font-family: 'Poor Story', sans-serif; font-weight: 600;">선택할 수 있습니다.</p>
          <p class="text-center limit-date">제한범위 : {{ `${this.minLimitDay} ~ ${this.maxLimitDay}` }}</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <span></span>
          <v-spacer></v-spacer>
          <v-btn small color="#E6CC00" @click="tryAgainDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'DinnerLabMostSelect',
  data() {
    return {
      dates: [],
      minLimitDay: '',
      maxLimitDay: '',
      sendAnalysis: false,
      tryAgainDialog: false
    }
  },
  created() {
    let todayValue = this.$store.state.todayElements
    let dinnerLength = this.$store.state.allDinnerData.length
    let dinnerFirstDayValue = this.$store.state.allDinnerData[dinnerLength - 1].date.toLocaleDateString().split('.').splice(0, 3)
    let dinnerLastDayValue = this.$store.state.allDinnerData[0].date.toLocaleDateString().split('.').splice(0, 3)
    this.dates.push(this.convertDate(todayValue))
    this.maxLimitDay = this.convertDate(dinnerLastDayValue)
    this.minLimitDay = this.convertDate(dinnerFirstDayValue)
  },
  methods: {
    sendData() {
      let data = {
        minDay: this.dates[0],
        maxDay: this.dates[1],
        minLimitDay: this.minLimitDay,
        maxLimitDay: this.maxLimitDay
      }
      this.$emit('receiveData', data)
      this.sendAnalysis = true
      this.$store.state.analysisComplete = true
    },
    convertDate(date) {
      let year = date[0]
      let month = date[1].trim().length === 1 ? '0' + date[1].trim() : date[1].trim()
      let day = date[2].trim().length === 1 ? '0' + date[2].trim() : date[2].trim()
      return [year, month, day].join('-')
    }
  },
  computed: {
    dateRangeText() {
      let endDate = this.dates.length === 2 ? this.dates[1] : '[종료 날짜]'
      let text = `${this.dates[0]} 부터 ${endDate} 까지`
      return text
    },
    message() {
      if (this.sendAnalysis) {
        return '다른 기간으로 분석하고 싶으면 날짜를 재설정하세요.'
      } else {
        return this.dates.length === 1 ? '기간을 정해야 분석할 수 있습니다.' : "우측 '분석' 버튼을 눌러주세요."
      }
    }
  },
  watch: {
    dates: {
      handler(newValue, oldValue) {
        this.$store.state.analysisComplete = false
        this.sendAnalysis = false
        if(newValue.length === 2) {
          const condition = (Date.parse(newValue[1]) > Date.parse(this.maxLimitDay) || Date.parse(newValue[0]) > Date.parse(this.maxLimitDay))
                            || (Date.parse(newValue[1]) < Date.parse(this.minLimitDay) || Date.parse(newValue[0]) < Date.parse(this.minLimitDay))
          if (condition) {
            this.dates = oldValue
            this.tryAgainDialog = true
          } else {
            if ((Date.parse(this.dates[0]) > Date.parse(this.dates[1]))) {
              this.dates.reverse()
            } else if (this.dates[0] === this.dates[1]) {
              this.dates.pop()
            }
          }
        } else {
          if (Date.parse(this.dates[0]) > Date.parse(this.maxLimitDay) || Date.parse(this.dates[0]) < Date.parse(this.minLimitDay)) {
            this.dates = oldValue
            this.tryAgainDialog = true
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  .analysis-btn-wrapper {
    display: flex;
    justify-content: space-between;
    font-family: 'Poor Story';
  }

  .alert-message {
    font-weight: 600;
  }

  #try-again-card {
    color: #424040;
  }

  .limit-date {
    font-family: 'Poor Story';
    font-size: 1.1em;
    font-weight: 600;
    color: crimson;
    padding-top: 10px;
  }
</style>