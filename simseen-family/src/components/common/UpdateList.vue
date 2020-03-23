<template>
  <div>
    <div class="comment-wrapper" v-for="i in updates.length" :key="i">
      <div class="comment-title"><strong>{{ updates[i - 1].title }}</strong></div>
      <ul class="comment-contents" v-for="j in updates[i - 1].body.length" :key="j">
        <li v-html="updates[i - 1].body[j - 1]"></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpdateList',
  props: ['updates']
}
</script>

<style scoped>
  .comment-wrapper:not(:last-child) {
    margin-bottom: 1.7em;
  }

  .comment-title {
    font-size: 1.15em;
    margin-bottom: 5px;
  }

  .comment-contents  li{
    margin-bottom: 2px;
  }
</style>