<template>
  <div style="font-family: 'Noto Sans KR';">
    <v-data-table
      :headers="tableHeaders"
      :items="notices"
      :items-per-page="itemsPerPage"
      :single-expand="true"
      :expanded.sync="expanded"
      :page.sync="page"
      item-key="created_at"
      show-expand
      hide-default-footer
      @page-count="pageCount = $event"
      class="elevation-1">
      <template v-slot:expanded-item="{ headers, item }">
        <td class="pa-4" :colspan="headers.length">
          <p class="text-center" v-if="item.imgUrl !== ''">
            <img :src="item.imgUrl" alt="notice-img" id="notice-img" style="margin-left: auto; margin-right: auto; display: block;">
          </p>
          <hr v-if="item.imgUrl !== ''">
          <div class="mt-2" style="line-height: 24px;">{{ item.body }}</div>
        </td>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount" :total-visible="7" circle color="#E6CC00"></v-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoticeTable',
  props: ['notices'],
  data() {
    return {
      tableHeaders: [
        { text: '제목', value: 'title' },
        { text: '작성자', value: 'user' },
      ],
      page: 1,
      pageCount: parseInt(this.notices.length / 5),
      itemsPerPage: 5
    }
  }
}
</script>

<style scoped>
  @media (orientation: portrait) {
    p > img[id="notice-img"] {
      display: block;
      margin: 0 auto;
      width: 70%;
    }
  }

  @media (orientation: landscape) {
    p > img[id="notice-img"] {
      display: block;
      margin: 0 auto;
      width: 50%;
    }
  }
</style>