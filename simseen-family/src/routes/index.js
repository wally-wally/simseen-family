import Vue from 'vue'
import Router from 'vue-router'
import { loadView } from '@/utils/loadView.js'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      component: loadView('MainPage')
    },
    {
      path: '/notice',
      name: 'notice',
      component: loadView('NoticePage')
    },
    {
      path: '/bible',
      name: 'bible',
      component: loadView('BiblePage')
    },
    {
      path: '/dinner',
      component: loadView('DinnerPage'),
      children: [
        {
          path: '',
          name: 'DinnerEdit',
          component: () => import('@/components/Dinner/Dinner')
        },
        {
          path: 'lab',
          name: 'DinnerLab',
          component: () => import('@/components/DinnerLab/DinnerLab')
        }
      ]
    },
    {
      path: '/memo',
      name: 'memo',
      component: loadView('MemoPage')
    },
    {
      path: '*',
      name: 'NotFound',
      component: loadView('NotFoundPage')
    }
  ]
})