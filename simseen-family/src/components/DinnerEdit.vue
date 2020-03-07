<template>
  <div class="mx-2 my-5">
    <div class="dinner-edit-wrapper">
      <v-text-field v-model="menus[0]" label="밥" :counter="8" :rules="dinnerRules" required></v-text-field>
      <v-text-field v-model="menus[1]" label="국" :counter="8" :rules="dinnerRules" required></v-text-field>
      <v-text-field v-model="menus[2]" label="메인메뉴" :counter="8" :rules="dinnerRules" required></v-text-field>
      <v-text-field v-model="menus[3]" label="반찬" :counter="8" :rules="dinnerRules" required></v-text-field>
      <v-text-field v-model="menus[4]" label="반찬 또는 김치" :counter="8" :rules="dinnerRules" required></v-text-field>
      <v-text-field v-model="menus[5]" label="반찬 또는 김치" :counter="8" :rules="dinnerRules" required></v-text-field>
    </div>
    <v-card-actions class="pt-4 pb-0 px-0">
      <v-spacer></v-spacer>
      <v-btn v-if="this.noMenu" rounded color="error" dark id="dinner-buttons" @click="postDinner(0)">식단 등록</v-btn>
      <v-btn v-else rounded color="#F79F0F" dark id="dinner-buttons" @click="postDinner(1)">메뉴 수정</v-btn>
    </v-card-actions>
    <v-dialog v-model="dinnerDialog" persistent>
      <v-card>
        <v-card-text class="px-4 pt-4 pb-2" id="notice-card">
          <p class="text-center">
            <img src="../assets/dinner_icon.png" alt="dinner_icon" width="200">
          </p>
          <p class="text-center mt-6 mb-4" style="font-size: 1.4em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;">{{ dinnerAlert }} 완료!</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <span></span>
          <v-spacer></v-spacer>
          <v-btn small color="#E6CC00" @click="dinnerDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="noDinnerDialog" persistent>
      <v-card>
        <v-card-text class="px-4 pt-4 pb-2" id="notice-card">
          <p class="text-center">
            <img src="../assets/dinner_icon.png" alt="dinner_icon" width="200">
          </p>
          <p class="text-center mt-6 mb-4" style="font-size: 1.4em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;">이건 나만 할 수 있다고^^</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <span></span>
          <v-spacer></v-spacer>
          <v-btn small color="#E6CC00" @click="noDinnerDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FirebaseService from '@/services/FirebaseService'

export default {
  name: 'DinnerEdit',
  props: ['dinnerMenus', 'pickedDate', 'noMenu'],
  data() {
    return {
      menus: this.noMenu === 1 ? ['', '', '', '', '', ''] : this.dinnerMenus,
      dinnerRules: [
        v => v.length <= 8 || '최대 8자까지 작성 가능합니다.'
      ],
      noDinnerDialog: false,
      dinnerDialog: false,
      dinnerAlert: ''
    }
  },
  methods: {
    async postDinner(status) {
      if (this.$store.state.user === '김영숙' && this.$store.state.email === 'k24116297@gmail.com' && this.$store.state.familyAuth) {
        this.dinnerAlert = status ? '수정' : '등록'
        await FirebaseService.postDinner(this.pickedDate, this.menus)
        this.$emit('postDinner')
        this.dinnerDialog = true
      } else {
        this.noDinnerDialog = true
      }
    },
    settingMenus() {
      if (this.noMenu === 1) {
        this.menus = ['', '', '', '', '', '']
      } else {
        let reMenus = ['', '', '', '', '', '']
        for (let i = 0; i < 6; i++) {
          reMenus[i] = i < this.dinnerMenus.length ? this.dinnerMenus[i] : ''
        }
        this.menus = reMenus
      }
    }
  },
  watch: {
    pickedDate() {
      this.settingMenus()
    },
    dinnerMenus() {
      this.settingMenus()
    }
  }
}
</script>

<style scoped>
  .dinner-edit-wrapper {
    font-size: 15px;
    font-weight: 600;
    font-family: 'Poor Story';
    color: black;
  }

  #dinner-buttons {
    font-family: 'Stylish';
  }
</style>