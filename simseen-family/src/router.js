import Vue from 'vue'
import Router from 'vue-router'

import Main from '@/views/Main'
import NoticePage from '@/views/NoticePage'
import DinnerPage from '@/views/DinnerPage'
import MemoPage from '@/views/MemoPage'
import BiblePage from '@/views/BiblePage'

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
      path: '/bible',
      name: 'bible',
      component: BiblePage
    },
    {
      path: '/dinner',
      name: 'dinner',
      component: DinnerPage
    },
    {
      path: '/memo',
      name: 'memo',
      component: MemoPage
    }
  ]
})