<template>
  <div class="mx-4 my-5">
    <div class="dinner-title">
      <div class="dinner-title-body">
        <i class="fas fa-utensils"></i>
      </div>
      <div class="dinner-weekly-icon" @click.stop="dialog = true">
        <i class="fas fa-clipboard"></i>
      </div>
    </div>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title><span class="menu-dialog-title">이번주 식단</span></v-card-title>
        <v-card-text>
          <div v-for="menuData in weeklyDinnerMenus" :key="menuData" class="dinner-menu-form">
            <div v-if="menuData.date.getDay() !== 6" :class="menuData.date.getDay() === 0 ? 'sunday-check' : 'dinner-menu-dialog'">
              {{ menuData.date.toLocaleString().slice(2, 11) }} ({{ dayOfTheWeek[menuData.date.getDay()] }})
            </div>
            <div v-else class="saturday-check">
              {{ menuData.date.toLocaleString().slice(2, 11) }} ({{ dayOfTheWeek[menuData.date.getDay()] }})
            </div>
            <div class="dinner-select row mt-2">
              <div class="col-6 py-1" v-for="menu in menuData.menus" :key="`${menu}-1`">
                <div class="text-center">{{ menu }}</div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <div class="dinner-content">
      <v-row justify="center">
        <v-date-picker
          v-model="pickedDate"
          class="mx-3 my-2"
          full-width
          :landscape="$vuetify.breakpoint.sm"
          color="#E6CC00"
        ></v-date-picker>
      </v-row>
      <div class="dinner-select row mt-2">
        <div class="col-12" v-if="noMenu === 1">
          <div class="text-center">등록된 저녁 메뉴가 없습니다.</div>
        </div>
        <div class="col-6 py-1" v-else v-for="menu in dinnerMenus" :key="menu">
          <div class="text-center">{{ menu }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import FirebaseService from '@/services/FirebaseService'

export default {
  name: 'Dinner',
  data() {
    return {
      dinnerData: [],
      dinnerMenus: [],
      weeklyDinnerMenus: [],
      noMenu: 0,
      pickedDate: this.$store.getters.todayValue[1],
      dialog: false
    }
  },
  mounted() {
    this.getDinner()
  },
  methods: {
    findDinner(dinnerData) {
      let selectDinner = this.dinnerMenus
      let findDinnerCheck = 0
      for (let i = 0; i < dinnerData.length; i++) {
        let dayObj = {
          componentName: 'Dinner',
          checkDate: dinnerData[i].date.toLocaleDateString()
        }
        this.$store.commit('convertDateValue', dayObj)
        let pickedDayValue = Number(this.pickedDate.split('-').join(''))
        let checkDayValue = this.dinnerCheckDayValue
        if (pickedDayValue === checkDayValue) {
          selectDinner = dinnerData[i].menus
          this.noMenu = 0
          findDinnerCheck = 1
          break
        }
      }
      if (this.dinnerMenus === [] || (findDinnerCheck === 0 && this.dinnerMenus === selectDinner)) {
        this.noMenu = 1
      } else {
        this.dinnerMenus = selectDinner
      }
    },
    async getDinner() {
      this.dinnerData = await FirebaseService.getDinner()
      this.findDinner(this.dinnerData)
      this.findWeeklyDinner(this.dinnerData)
    },
    findWeeklyDinner(dinnerData) {
      let todayDateValue = Date.parse(this.todayValue[1])
      let dayObj = {
        componentName: 'Dinner-Last',
        checkDate: dinnerData[0].date.toLocaleDateString()
      }
      this.$store.commit('convertDateValue', dayObj)
      let lastDateValue = Date.parse(this.lastDinnerCheckDayValue)
      let diffDateValue = Math.abs(lastDateValue - todayDateValue) / 86400000
      let todayDayOfTheWeek = this.todayDate.getDay()
      let startIdx = diffDateValue - (6 - todayDayOfTheWeek)
      this.weeklyDinnerMenus = this.dinnerData.slice(startIdx, startIdx + 7).reverse()
    }
  },
  watch: {
    pickedDate() {
      this.findDinner(this.dinnerData)
    }
  },
  computed: {
    ...mapState(['todayDate', 'dayOfTheWeek', 'dinnerCheckDayValue', 'lastDinnerCheckDayValue']),
    ...mapGetters(['todayValue'])
  }
}
</script>

<style scoped>
  .dinner-title {
    display: flex;
    justify-content: space-between;
    margin: 8px 0;
  }

  .dinner-title .dinner-title-body {
    font-weight: bold;
    font-size: 18px;
  }

  .dinner-title .dinner-title-body .fas::after {
    content: '영숙이의 급식소';
    font-family: 'Yeon Sung';
  }

  .dinner-title .dinner-weekly-icon {
    font-weight: bold;
    border-radius: 10px 10px;
    border: 1px solid lightgray;
    background-color: #F4F2DB;
    padding: 0 0.5rem;
  }

  .dinner-title .dinner-weekly-icon .fas::after {
    content: '이번주 식단';
    font-family: 'Stylish';
  }

  .dinner-select {
    font-family: 'Gaegu';
    font-size: 18px;
    color: #7a7a7a;
  }

  .menu-dialog-title {
    font-size: 22px;
    font-family: 'Yeon Sung';
    font-weight: bold;
  }

  .dinner-menu-form {
    padding-bottom: 10px;
    border-bottom: 1px solid lightgray;
    margin-bottom: 10px;
  }

  .dinner-menu-dialog {
    font-size: 15px;
    font-weight: 600;
    font-family: 'Poor Story';
    color: black;
  }

  .sunday-check {
    font-size: 15px;
    font-weight: 600;
    font-family: 'Poor Story';
    color: red;
  }

  .saturday-check {
    font-size: 15px;
    font-weight: 600;
    font-family: 'Poor Story';
    color: blue;
  }
</style>