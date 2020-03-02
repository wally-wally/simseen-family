<template>
  <div class="mx-4 my-5">
    <div class="dinner-title">
      <i class="fas fa-utensils"></i>
    </div>
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
      noMenu: 0,
      pickedDate: this.$store.getters.todayValue[1]
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
    }
  },
  watch: {
    pickedDate() {
      this.findDinner(this.dinnerData)
    }
  },
  computed: {
    ...mapState(['dinnerCheckDayValue']),
    ...mapGetters(['todayValue'])
  }
}
</script>

<style scoped>
  .dinner-title {
    font-weight: bold;
    font-size: 18px;
    margin: 8px 0;
  }

  .dinner-title .fas::after {
    content: '영숙이의 급식소';
    font-family: 'Yeon Sung';
  }

  .dinner-select {
    font-family: 'Gaegu';
    font-size: 18px;
    color: #7a7a7a;
  }
</style>