<template>
  <div class="my-4">
    <canvas ref="barChart" id="barChart"></canvas>
    <div class="tie-rate" v-if="this.$store.state.analysisComplete">(동률의 경우 가나다순으로 정렬)</div>
    <transition name="fade" mode="out-in">
      <div v-if="etcData.length && this.showEtc" class="etc-dinner-data">
        <div v-for="i in etcData.length" :key="i">
          <v-list-item dense>
            <v-list-item-icon class="mr-6">{{ `${i + 5}위` }}</v-list-item-icon>
            <v-list-item-content class="d-block"><span class="mr-3">{{ etcData[i - 1][0] }}</span> | <small class="ml-2">{{ `${etcData[i - 1][1]}회`}}</small></v-list-item-content>
          </v-list-item>
        </div>
      </div>
    </transition>
    <v-btn v-if="etcData.length" class="mt-4" block color="#F79F0F" dark :style="{ fontFamily: 'Poor Story' }" @click.prevent="showEtcData">기타 순위({{ etcData.length }}개 메뉴)
      <span v-if="this.showEtc">숨기기</span>
      <span v-else>확인하기</span></v-btn>
  </div>
</template>

<script>
export default {
  props: ['sendData', 'selectElement'],
  data() {
    return {
      chart: '',
      etcData: [],
      showEtc: false
    }
  },
  mounted() {
    if (this.selectElement === 1) {
      this.analysisOne()
    }
  },
  methods: {
    insertChart(labels, data) {
      var chart = new this.$_Chart(this.$refs.barChart, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: '등록 횟수',
            data: data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            xAxes: [{
              ticks: {
                fontSize: 9
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                stepSize: 1
              }
            }]
          }
        }
      })
      this.chart = chart
    },
    analysisOne() {
      let minDay = this.sendData.minDay
      let maxDay = this.sendData.maxDay
      let maxLimitDay = this.sendData.maxLimitDay
      let startIndex = (Date.parse(maxLimitDay) - Date.parse(maxDay)) / 86400000
      let extractDataCount = ((Date.parse(maxDay) - Date.parse(minDay)) / 86400000) + 1
      let partialDinnerData = this.$store.state.allDinnerData.slice(startIndex, startIndex + extractDataCount)
      let allMenus = {}
      partialDinnerData.forEach(data => {
        let menus = data.menus
        menus.forEach(menu => {
          let noBasicMenu = (menu.slice(menu.length - 2, menu.length) !== '김치') && (menu.slice(menu.length - 1, menu.length) !== '밥' && menu !== '짜장밥')
          if (Object.prototype.hasOwnProperty.call(allMenus, menu) && menu !== '' && noBasicMenu) {
            allMenus[menu] += 1
          } else if(!Object.prototype.hasOwnProperty.call(allMenus, menu) && menu !== '' && noBasicMenu) {
            allMenus[menu] = 1
          }
        })
      })
      let entries = Object.entries(allMenus)
      let menusLength = entries.length
      let sortedMenus = entries.sort((a, b) => {
        if (a[1] !== b[1]) {
          return b[1] - a[1]
        } else {
          return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0
        }
      })
      let labels = []
      let data = []
      sortedMenus.slice(0, 5).forEach(menu => {
        labels.push(menu[0])
        data.push(menu[1])
      })
      if (menusLength >= 6) {
        this.etcData = sortedMenus.slice(5, menusLength)
      }
      this.insertChart(labels, data)
    },
    showEtcData() {
      this.showEtc = !this.showEtc
    }
  }
}
</script>

<style scoped>
  .tie-rate {
    font-size: 0.9em;
    font-family: 'Poor Story';
    font-weight: 600;
    color: #636363;
    text-align: right;
  }

  .etc-dinner-data {
    font-family: 'Poor Story';
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>