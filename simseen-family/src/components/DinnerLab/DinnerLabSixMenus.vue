<template>
  <div>
    <p class="waiting-alert">
      <i class="fas fa-tools d-block"></i>
      <span class="alert-message">준비중입니다.</span>
      <span class="alert-message">조금만 기다려주세요.</span>
    </p>
  </div>
</template>

<style scoped>
  .waiting-alert {
    margin: 20px 0;
    text-align: center;
  }

  .waiting-alert .fas {
    font-size: 110px;
    color: #838704;
    margin-bottom: 30px;
    animation: emphasis 1s linear infinite alternate;
  }

  .waiting-alert .alert-message {
    display: block;
    font-family: 'Gothic A1';
    font-weight: 600;
    font-size: 1.05em;
    letter-spacing: -0.02em;
    margin-top: 10px;
  }
</style>