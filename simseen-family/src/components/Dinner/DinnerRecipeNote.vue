<template>
  <div class="mt-3">
    <v-textarea
      v-model="recipe"
      :placeholder="this.loadingStatus ? '데이터를 불러오는 중 입니다.' : '레시피를 작성하세요.'"
      color="#E6CC00"
      outlined
      auto-grow
      :style="{ fontFamily: 'Poor Story', marginBottom: '-8px' }"></v-textarea>
    <v-card-actions class="pt-0 pb-1 px-0" :style="{ fontFamily: 'Poor Story', fontSize: '14px' }">
      <span class="alert-section">{{ alertMessage }}</span>
      <v-spacer></v-spacer>
      <v-btn rounded color="error" dark @click="postRecipeNote()" :disabled="!recipe.length ? true : false">저장</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import FirebaseService from '@/services/FirebaseService'

export default {
  name: 'DinnerRecipeNote',
  data() {
    return {
      recipe: '',
      alertMessage: '레시피를 등록하려면 최소 1자 이상 작성하세요.',
      loadingStatus: 1
    }
  },
  created() {
    this.getRecipeNote()
  },
  methods: {
    async getRecipeNote() {
      let getData = await FirebaseService.getRecipeNote()
      this.recipe = getData.recipe
      this.loadingStatus = 0
    },
    async postRecipeNote() {
      await FirebaseService.postDinnerMemo(this.recipe, 1)
      this.alertMessage = '저장되었습니다.'
      setTimeout(() => {
        this.alertMessage = '레시피를 등록하려면 최소 1자 이상 작성하세요.'
      }, 3000)
    }
  }
}
</script>

<style>

</style>