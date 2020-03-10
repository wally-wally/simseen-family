<template>
  <div class="ma-4">
    <div class="todo-title">
      <i class="fas fa-list"></i>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
  .todo-title {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 8px;
  }

  .todo-title .fas::after {
    content: ' 체크리스트';
    font-family: 'Yeon Sung';
  }
</style>