<template>
  <div class="mx-4 my-5">
    <div class="dinner-lab-title">
      <div class="dinner-lab-title-header">
        <i class="fas fa-chart-bar"></i>
      </div>
    </div>
    <div class="dinner-lab-body">
      <div class="lab-select-wrapper">
        <v-select
          v-model="selectedItem"
          :items="items"
          label="항목을 선택하세요."
          class="ma-0 pt-3"
          color="#E6CC00"
          dense
          :style="{ fontFamily: 'Poor Story' }"></v-select>
      </div>
      <div class="dinner-lab-form">
        <transition name="fade" mode="out-in" v-if="this.showLabFormNm === 0">
          <p class="select-alert">
            <i class="fas fa-check-circle d-block"></i>
            <span class="select-alert-message">항목을 선택하면 분석 form이 나타납니다.</span>
          </p>
        </transition>
        <transition name="fade" mode="out-in" v-else-if="this.showLabFormNm === 1">
          <DinnerLabMostSelect @receiveData="storeData"></DinnerLabMostSelect>
        </transition>
        <transition name="fade" mode="out-in" v-else-if="this.showLabFormNm === 2">
          <DinnerLabSixMenus></DinnerLabSixMenus>
        </transition>
        <transition name="fade" mode="out-in" v-if="this.analysisComplete">
          <DinnerLabAnalysis :sendData="receiveData" :selectElement="this.showLabFormNm"></DinnerLabAnalysis>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DinnerLabMostSelect from '@/components/DinnerLab/DinnerLabMostSelect.vue'
import DinnerLabSixMenus from '@/components/DinnerLab/DinnerLabSixMenus.vue'
import DinnerLabAnalysis from '@/components/DinnerLab/DinnerLabAnalysis.vue'

export default {
  name: 'DinnerLab',
  components: {
    DinnerLabMostSelect,
    DinnerLabSixMenus,
    DinnerLabAnalysis
  },
  computed: {
    ...mapState(['analysisComplete'])
  },
  data() {
    return {
      items: [
        '1. 어떤 메뉴를 가장 많이 먹었을까? (Top5)',
        '2. (준비중...)'
      ],
      selectedItem: '',
      showLabFormNm: 0,
      receiveData: ''
    }
  },
  methods: {
    storeData(value) {
      this.receiveData = value
    },
  },
  watch: {
    selectedItem() {
      this.showLabFormNm = Number(this.selectedItem.split('.')[0])
      this.$store.state.analysisComplete = false
    }
  }
}
</script>

<style scoped>
  .dinner-lab-title {
    margin: 8px 0;
  }

  .dinner-lab-title .dinner-lab-title-header {
    font-weight: bold;
    font-size: 18px;
  }

  .dinner-lab-title .dinner-lab-title-header .fas::after {
    content: ' 영숙이의 급식소 - 분석실';
    font-family: 'Yeon Sung';
  }

  .select-alert {
    margin: 20px 0;
    text-align: center;
  }

  .select-alert .fas {
    font-size: 110px;
    color: #838704;
    margin-bottom: 15px;
    animation: emphasis 1s linear infinite alternate;
  }

  .select-alert .select-alert-message {
    display: inline-block;
    font-family: 'Gothic A1';
    font-weight: 600;
    font-size: 1.05em;
    letter-spacing: -0.02em;
    margin-top: 15px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  @keyframes emphasis {
    from {
      transform: scale(1);
    }

    to {
      transform: scale(1.15);
    }
  }
</style>