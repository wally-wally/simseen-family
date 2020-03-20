<template>
  <div class="mt-8">
    <div class="dinner-wish-title">
      <div class="dinner-wish-title-body">
        <i class="fas fa-utensils"></i>
        <span style="font-family: 'Poor Story'; font-size: 13px;">(1인당 최대 3개 등록 가능)</span>
      </div>
    </div>
    <div class="dinner-wish-input">
      <v-row v-if="wishMenus.length === 12">
        <v-col cols="12">
          <div class="text-centet">희망 메뉴는 <strong>최대 12개</strong>까지 등록 가능합니다.</div>
        </v-col>
      </v-row>
      <v-row v-else-if="wishMenus.length < 12 && myMenuCount < 3">
        <v-col cols="10" class="py-0 pl-4 pr-1">
          <v-text-field
            v-model="menu"
            label="메뉴(1자 이상 8자 이하로 작성 가능)"
            color="#E6CC00"
            :counter="0"
            :style="{ fontFamily: 'Poor Story' }">
          </v-text-field>
        </v-col>
        <v-col cols="2" :style="{ lineHeight: '70px', textAlign: 'center' }" class="py-0 pl-1 pr-4">
          <v-btn small class="px-1" color="#E6CC00" :disabled="menu.length < 1 || menu.length > 8 ? true : false" :style="{ fontFamily: 'Poor Story' }" @click="addWishMenu()">추가</v-btn>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12">
          <div class="text-center">한 사람당 <strong>최대 3개</strong> 메뉴를 등록할 수 있습니다.</div>
        </v-col>
      </v-row>
      <div class="ma-2">
        <div class="row dinner-wish-list">
          <div class="col-12 py-2" v-if="wishMenus.length === 0">
            <div class="text-center">등록된 희망 저녁 메뉴가 없습니다.</div>
          </div>
          <div class="col-6 py-2" v-else v-for="i in this.wishMenus.length" :key="i">
            <div class="text-center">{{ wishMenus[i - 1].menu }}
              <i v-if="wishMenus[i - 1].user === email.split('@')[0]" class="fas fa-times pl-1" style="color: #FAA592;" @click="deleteWishMenu(i - 1)"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import FirebaseService from '@/services/FirebaseService'

export default {
  name: 'DinnerWish',
  computed: {
    ...mapState(['email'])
  },
  data() {
    return {
      wishMenus: [],
      menu: '',
      myMenuCount: 0
    }
  },
  created() {
    this.getDinnerWish()
  },
  methods: {
    getMyMenuCount() {
      this.myMenuCount = this.wishMenus.filter(item => item.user === this.$store.state.email.split('@')[0]).length
    },
    async getDinnerWish() {
      let getMenus = await FirebaseService.getDinnerWish()
      this.wishMenus = getMenus[0]
      this.getMyMenuCount()
    },
    addWishMenu() {
      let addData = {
        menu: this.menu,
        user: this.$store.state.email.split('@')[0]
      }
      this.wishMenus.push(addData)
      this.menu = ''
      FirebaseService.postDinnerWish(this.wishMenus)
      this.getMyMenuCount()
    },
    deleteWishMenu(idx) {
      this.wishMenus.splice(idx, 1)
      FirebaseService.postDinnerWish(this.wishMenus)
      this.getMyMenuCount()
    }
  }
}
</script>

<style scoped>
  .dinner-wish-title {
    display: flex;
    justify-content: space-between;
  }

  .dinner-wish-title .dinner-wish-title-body {
    font-weight: bold;
    font-size: 18px;
  }

  .dinner-wish-title .dinner-wish-title-body .fas::after {
    content: ' 이 메뉴 먹고 싶어요!';
    font-family: 'Yeon Sung';
  }

  .dinner-wish-input {
    font-family: 'Poor Story';
  }

  .dinner-wish-list {
    border: 1px solid gray;
    border-radius: 10px;
    box-shadow: 3px 3px 5px lightgray;
  }
</style>