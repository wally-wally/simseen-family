<template>
  <div class="mt-6">
    <div class="cart-title">
      <div class="cart-title-body">
        <i class="fas fa-shopping-cart"></i>
      </div>
      <div style="line-height: 27px;">
        <span class="cart-delete-icon mr-1" @click="resetCart">
          <i class="fas fa-eraser"></i>
        </span>
      </div>
    </div>
    <v-textarea
      v-model="cartList"
      placeholder="장보기 리스트를 작성하세요."
      color="#E6CC00"
      outlined
      auto-grow
      :style="{ fontFamily: 'Poor Story' }"></v-textarea>
    <v-card-actions class="pt-0 pb-1 px-0" :style="{ fontFamily: 'Poor Story', fontSize: '14px' }">
      <span class="alert-section">{{ dinnerCartAlert }}</span>
      <v-spacer></v-spacer>
      <v-btn rounded color="error" dark @click="postDinnerCart()" :disabled="!cartList.length ? true : false">저장</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import FirebaseService from '@/services/FirebaseService'

export default {
  name: 'DinnerCart',
  data() {
    return {
      cartList: '',
      dinnerCartAlert: '메모를 등록하려면 최소 1자 이상 작성하세요.'
    }
  },
  created() {
    this.getDinnerCart()
  },
  methods: {
    async getDinnerCart() {
      let cartMemo = await FirebaseService.getDinnerCart()
      this.cartList = cartMemo[0]
    },
    resetCart() {
      this.cartList = ''
    },
    async postDinnerCart() {
      await FirebaseService.postDinnerCart(this.cartList)
      this.dinnerCartAlert = '저장되었습니다.'
      setTimeout(() => {
        this.dinnerCartAlert = '메모를 등록하려면 최소 1자 이상 작성하세요.'
      }, 4000)
    }
  }
}
</script>

<style scoped>
  .cart-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .cart-title .cart-title-body .fas::after {
    content: ' 장보기 메모장';
    font-family: 'Stylish';
  }

  .cart-delete-icon {
    font-size: 15px;
    font-weight: bold;
    border-radius: 10px 10px;
    border: 1px solid lightgray;
    background-color: #FBD2D0;
    padding: 0 0.5rem;
  }

  .cart-delete-icon .fas::after {
    content: '전체 삭제';
    font-family: 'Stylish';
  }
</style>