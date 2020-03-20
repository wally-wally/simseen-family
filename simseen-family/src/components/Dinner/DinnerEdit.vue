<template>
  <div class="mx-2 my-5">
    <div class="dinner-edit-wrapper">
      <v-form v-model="valid">
        <v-text-field v-model="menus[0]" label="메뉴1" :counter="8" :rules="dinnerRules" color="#E6CC00"></v-text-field>
        <v-text-field v-model="menus[1]" label="메뉴2" :counter="8" :rules="dinnerRules" color="#E6CC00"></v-text-field>
        <v-text-field v-model="menus[2]" label="메뉴3" :counter="8" :rules="dinnerRules" color="#E6CC00"></v-text-field>
        <v-text-field v-model="menus[3]" label="메뉴4" :counter="8" :rules="dinnerRules" color="#E6CC00"></v-text-field>
        <v-text-field v-model="menus[4]" label="메뉴5" :counter="8" :rules="dinnerRules" color="#E6CC00"></v-text-field>
        <v-text-field v-model="menus[5]" label="메뉴6" :counter="8" :rules="dinnerRules" color="#E6CC00"></v-text-field>
      </v-form>
    </div>
    <v-card-actions class="pt-4 pb-0 px-0">
      <span class="alert-section" :style="{ color: noWriteMenu || !valid ? 'red' : 'black' }">{{ dinnerMessage }}</span>
      <v-spacer></v-spacer>
      <v-btn v-if="this.noMenu" rounded color="error" dark id="dinner-buttons" @click="postDinner(0)" :disabled="noWriteMenu || !valid ? true : false">식단 등록</v-btn>
      <v-btn v-else rounded color="#F79F0F" dark id="dinner-buttons" @click="postDinner(1)" :disabled="noWriteMenu || !valid ? true : false">메뉴 수정</v-btn>
    </v-card-actions>
    <hr class="mt-8" color="lightgray">
    <DinnerWish></DinnerWish>
    <v-dialog v-model="dinnerDialog" persistent>
      <v-card>
        <v-card-text class="px-4 pt-4 pb-2" id="notice-card">
          <p class="text-center">
            <img src="../../assets/images/dinner_icon.png" alt="dinner_icon" width="200">
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
            <img src="../../assets/images/dinner_icon.png" alt="dinner_icon" width="200">
          </p>
          <p class="text-center mt-6 mb-4" style="font-size: 1.4em; font-family: 'Noto Sans KR', sans-serif; font-weight: 600;">이건 나만 할 수 있다고^^</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn small color="#E6CC00" @click="noDinnerDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DinnerWish from '@/components/Dinner/DinnerWish'
import FirebaseService from '@/services/FirebaseService'
import { dinnerEditAuthCheck } from '@/utils/dinnerEditAuth'

export default {
  name: 'DinnerEdit',
  props: ['dinnerMenus', 'pickedDate', 'noMenu'],
  components: {
    DinnerWish
  },
  data() {
    return {
      menus: this.noMenu === 1 ? ['', '', '', '', '', ''] : this.dinnerMenus,
      dinnerRules: [],
      noDinnerDialog: false,
      dinnerDialog: false,
      dinnerAlert: '',
      dinnerMessage: '',
      noWriteMenu: 0,
      valid: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.dinnerRules = [v => v.length <= 8 || '최대 8자까지 작성 가능합니다.']
    }, 1000)
  },
  methods: {
    async postDinner(status) {
      let userData = {
        name: this.$store.state.user,
        email: this.$store.state.email.split('@')[0]
      }
      const postCondition = dinnerEditAuthCheck(userData)
      if (this.$store.state.familyAuth && postCondition) {
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
      this.noWriteMenu = this.noMenu ? 1 : 0
      this.settingMenus()
    },
    dinnerMenus() {
      this.noWriteMenu = this.noMenu ? 1 : 0
      this.settingMenus()
    },
    menus() {
      this.noWriteMenu = !this.menus.join('').length ? 1 : 0
      this.dinnerMessage = this.noWriteMenu ? '[주의!] 최소 한 개 이상 메뉴를 등록하세요.' : '작성 완료 후 오른쪽 버튼을 누르세요.'
    },
    valid() {
      if (!this.valid) {
        this.dinnerMessage = '[주의!]메뉴당 최대 8자 작성할 수 있습니다.'
      }
    }
  }
}
</script>

<style scoped>
  .dinner-edit-wrapper,
  .alert-section {
    font-size: 15px;
    font-weight: 600;
    font-family: 'Poor Story';
    color: black;
  }

  .alert-section {
    letter-spacing: -0.01em;
  }

  #dinner-buttons {
    font-family: 'Stylish';
  }
</style>