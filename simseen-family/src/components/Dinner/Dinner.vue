<template>
  <div class="mx-4 my-5">
    <div class="dinner-title">
      <div class="dinner-title-body">
        <i class="fas fa-utensils"></i>
      </div>
      <div class="dinner-side-icons">
        <div class="dinner-lab-icon" v-if="this.$route.name === 'DinnerEdit'" @click="goDinnerLab">
          <i class="fas fa-chart-bar"></i>
        </div>
        <div class="dinner-weekly-icon" v-if="this.familyAuth" @click.stop="dialog = true">
          <i class="fas fa-clipboard"></i>
        </div>
      </div>
    </div>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="d-block pb-2 mb-3" :style="{ borderBottom: '1px solid lightgray'}">
          <div class="menu-dialog-title">이번주 식단</div>
          <div class="weekly-alert">(이번주에 등록된 식단만 표시됩니다.)</div>
        </v-card-title>
        <v-card-text v-if="weeklyDinnerMenus.length" class="px-6 pb-1">
          <div v-for="i in weeklyDinnerMenus.length" :key="i" class="dinner-menu-form" :style="{ 'backgroundColor': todayCheck(weeklyDinnerMenus[i - 1].date) ? '#F9F6E6' : '#FFFFFF' }">
            <div v-if="weeklyDinnerMenus[i - 1].date.getDay() !== 6" :class="weeklyDinnerMenus[i - 1].date.getDay() === 0 ? 'sunday-check' : 'dinner-menu-dialog'">
              {{ weeklyDinnerMenus[i - 1].date.toLocaleString().slice(2, 11) }} ({{ dayOfTheWeek[weeklyDinnerMenus[i - 1].date.getDay()] }})
            </div>
            <div v-else class="saturday-check">
              {{ weeklyDinnerMenus[i - 1].date.toLocaleString().slice(2, 11) }} ({{ dayOfTheWeek[weeklyDinnerMenus[i - 1].date.getDay()] }})
            </div>
            <div class="dinner-select row">
              <div class="dinner-menu-detail col-6" v-for="j in weeklyDinnerMenus[i - 1].menus.length" :key="j">
                <div class="text-center">{{ weeklyDinnerMenus[i - 1].menus[j - 1] }}</div>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-text v-else class="px-6 pb-1" >
          <div class="no-weekly-dinner">
            이번주에 등록된 메뉴가 없습니다.
          </div>
        </v-card-text>
        <v-card-actions class="pt-2 pb-4 pr-6">
          <span></span>
          <v-spacer></v-spacer>
          <v-btn small color="#E6CC00" @click="dialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="dinner-content">
      <v-row justify="center">
        <v-date-picker
          v-model="pickedDate"
          class="mx-3 my-2 dinner-calender"
          full-width
          :landscape="$vuetify.breakpoint.sm"
          locale="ko"
          color="#E6CC00"
        ></v-date-picker>
      </v-row>
      <div v-if="this.familyAuth">
        <div v-if="this.$route.name === 'main'" class="dinner-select row mt-2">
          <div class="col-12" v-if="noMenu === 1">
            <div class="text-center">등록된 저녁 메뉴가 없습니다.</div>
          </div>
          <div class="col-6 py-1" v-else v-for="i in dinnerMenus.length" :key="i">
            <div class="text-center">{{ dinnerMenus[i - 1] }}</div>
          </div>
        </div>
        <div v-else>
          <DinnerEdit :dinnerMenus="dinnerMenus" :pickedDate="pickedDate" :noMenu="noMenu" @postDinner="postDinner"></DinnerEdit>
        </div>
      </div>
      <div v-else-if="this.isLogin && !this.familyAuth" class="mt-2">
        <p class="text-center">
          <img src="../../assets/images/dinner_icon.png" alt="dinner_icon" width="100">
        </p>
        <p class="text-center login-please">음...? 우리 가족이 아닌데? 빠이^^</p>
      </div>
      <div v-else class="mt-2">
        <p class="text-center">
          <img src="../../assets/images/dinner_icon.png" alt="dinner_icon" width="100">
        </p>
        <p class="text-center login-please">보고 싶으면 먼저 로그인을 하세요.</p>
      </div>
    </div>
    <DinnerCart v-if="this.$route.name === 'main' && this.familyAuth"></DinnerCart>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import FirebaseService from '@/services/FirebaseService'
import DinnerEdit from '@/components/Dinner/DinnerEdit'
import DinnerCart from '@/components/Dinner/DinnerCart'

export default {
  name: 'Dinner',
  components: {
    DinnerEdit,
    DinnerCart
  },
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
  created() {
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
      this.$store.state.allDinnerData = this.dinnerData
      this.findDinner(this.dinnerData)
      this.findWeeklyDinner()
    },
    async postDinner() {
      this.dinnerData = await FirebaseService.getDinner()
      this.findDinner(this.dinnerData)
      this.findWeeklyDinner()
    },
    findWeeklyDinner() {
      let todayDateValue = Date.parse(this.todayValue[1])
      let thisWeeklyExist = this.dinnerData.some(data => {
        let checkDate = Date.parse(data.date)
        let todayDate = this.todayDate.getDay()
        let diffVal = (checkDate - todayDateValue) / 86400000
        return diffVal >= 0 - todayDate && diffVal <= 6 - todayDate ? true : false
      })
      
      if (thisWeeklyExist) {
        let sliceCount = this.dinnerData[0].date.getDay() + 1
        this.weeklyDinnerMenus = this.dinnerData.slice(0, sliceCount).reverse().filter(data => {
          let diffDay = Math.ceil((Date.parse(this.dinnerData[0].date) - Date.parse(data.date)) / 86400000)
          return diffDay <= sliceCount - 1 ? true : false
        })
      }
    },
    todayCheck(date) {
      let todayMonth = this.todayDate.getMonth() + 1
      let todayDay = this.todayDate.getDay()
      return todayMonth === date.getMonth() + 1 && todayDay === date.getDay() ? true : false
    },
    goDinnerLab() {
      this.$router.push('/dinner/lab')
    }
  },
  watch: {
    pickedDate() {
      this.findDinner(this.dinnerData)
    }
  },
  computed: {
    ...mapState(['isLogin','todayDate', 'dayOfTheWeek', 'dinnerCheckDayValue', 'lastDinnerCheckDayValue', 'familyAuth']),
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
    content: ' 영숙이의 급식소';
    font-family: 'Yeon Sung';
  }

  .dinner-title .dinner-lab-icon {
    display: inline-block;
    font-weight: bold;
    border-radius: 10px 10px;
    border: 1px solid lightgray;
    background-color: #FDF0E6;
    padding: 0 0.5rem;
    margin-right: 0.25rem;
  }

  .dinner-title .dinner-lab-icon .fas::after {
    content: '분석실';
    font-family: 'Stylish';
  }

  .dinner-title .dinner-weekly-icon {
    display: inline-block;
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

  .weekly-alert {
    font-family: 'Stylish';
    font-size: 14px;
    color: #5c5c5c;
  }

  .dinner-select,
  .login-please {
    font-family: 'Gaegu';
    font-size: 18px;
    color: #7a7a7a;
    margin-top: 3px;
  }

  .no-weekly-dinner {
    font-family: 'Gaegu';
    font-size: 18px;
    color: #7a7a7a;
    margin: 0.5em 0;
    text-align: center;
  }

  .dinner-menu-detail {
    padding: 3px 0;
  }

  .dinner-calender {
    font-family: 'Noto Sans KR';
  }

  .menu-dialog-title {
    font-size: 22px;
    font-family: 'Yeon Sung';
    font-weight: bold;
  }

  .dinner-menu-form {
    padding-bottom: 10px;
    border-bottom: 1px solid lightgray;
    margin: 0.3em 0 0.6em;
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