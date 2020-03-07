import Vue from 'vue'
import Router from 'vue-router'

import Main from '@/views/Main'
import NoticePage from '@/views/NoticePage'
import DinnerPage from '@/views/DinnerPage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/notice',
      name: 'notice',
      component: NoticePage
    },
    {
      path: '/dinner',
      name: 'dinner',
      component: DinnerPage
    }
  ]
})