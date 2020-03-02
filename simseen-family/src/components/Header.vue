<template>
  <div>
    <v-app-bar fixed color="#F4F2DB">
      <router-link to="/" style="text-decoration: none;"><span class="homepage-name">Simpson Family</span></router-link>
      <v-spacer></v-spacer>
      <nav class="nav">
        <router-link to="/notice"><i class="fas fa-clipboard-list notice-icon"></i></router-link>
        <img src="../assets/dinner_icon.png" alt="dinner-icon" id="dinner-icon" width="30">
      </nav>
    </v-app-bar>
  </div>
</template>

<style scoped>
  .homepage-name {
    color: #605856;
    font-family: 'Caveat' ;
    font-weight: bold;
    font-size: 26px;
    text-shadow: 2px 2px 5px lightgray;
    -webkit-animation:blink 1.5s ease-in-out infinite alternate;
    -moz-animation:blink 1.5s ease-in-out infinite alternate;
    animation:blink 1.5s ease-in-out infinite alternate;
  }

  .notice-icon {
    font-size: 30px;
    color: darkslategrey;
    margin-right: 10px;
  }

  .notice-icon:hover {
    cursor: pointer;
  }

  #dinner-icon {
    vertical-align: bottom;
  }

  @-webkit-keyframes blink{
    0% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes blink{
    0% {
      opacity:0.4;
    }

    100% {
      opacity:1;
    }
  }

  @keyframes blink{
    0% {
      opacity:0.4;
    }

    100% {
      opacity:1;
    }
  }
</style>