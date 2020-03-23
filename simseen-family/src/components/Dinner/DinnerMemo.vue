<template>
  <div class="dinner-memo">
    <nav class="dinner-memo-nav">
      <ul>
        <li @click="showDinnerMemoSection(0)">
          <span class="on" id="dinner-shopping-menu">쇼핑 리스트</span>
        </li>
        <li @click="showDinnerMemoSection(1)">
          <span class="" id="dinner-recipe-menu">레시피 노트</span>
        </li>
      </ul>
    </nav>
    <DinnerShoppingCart v-if="!selectStatus"></DinnerShoppingCart>
    <DinnerRecipeNote v-else></DinnerRecipeNote>
  </div>
</template>

<script>
import DinnerShoppingCart from '@/components/Dinner/DinnerShoppingCart'
import DinnerRecipeNote from '@/components/Dinner/DinnerRecipeNote'

export default {
  name: 'DinnerMemo',
  components: {
    DinnerShoppingCart,
    DinnerRecipeNote
  },
  data() {
    return {
      selectStatus: 0
    }
  },
  methods: {
    showDinnerMemoSection(status) {
      const dinnerShoppingTag = document.querySelector('#dinner-shopping-menu')
      const dinnerRecipeTag = document.querySelector('#dinner-recipe-menu')
      this.selectStatus = status
      if (status === 0) {
        dinnerShoppingTag.setAttribute('class', 'on')
        dinnerRecipeTag.setAttribute('class', '')
      } else {
        dinnerShoppingTag.setAttribute('class', '')
        dinnerRecipeTag.setAttribute('class', 'on')
      }
    }
  }
}
</script>

<style scoped>
  .dinner-memo * {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .dinner-memo-nav {
    margin-top: 0.7em;
  }

  .dinner-memo-nav ul {
    display: flex;
    height: 58px;
    padding: 0;
    border-bottom: 1px solid #f7b157;
  }

  .dinner-memo-nav ul li {
    flex: 1;
  }

  .dinner-memo-nav ul li:hover {
    cursor: pointer;
  }

  .dinner-memo-nav ul li:first-child span {
    border-left: 1px solid #ddd;
  }

  .dinner-memo-nav ul li span {
    display: block;
    height: 59px;
    border: 1px solid #ddd;
    border-left: none;
    border-bottom: none;
    font-size: 18px;
    font-weight: 700;
    font-family: 'Stylish';
    color: #505050;
    text-align: center;
    line-height: 59px;
    text-decoration: none;
  }

  .dinner-memo-nav ul li span.on {
    position: relative;
    height: 58px;
    border-color: #f7b157;
    border-top-width: 2px;
    line-height: 57px;
    border-bottom: 1px solid #fff;
  }

  .dinner-memo-nav ul li span.on::before {
    content: '';
    position: absolute;
    left: -1px;
    top: -2px;
    width: 1px;
    height: 100%;
    background: #ffc837;
    border-top: 2px solid #f7b157;
  }
</style>