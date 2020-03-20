import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('@/views/MainPage')
    },
    {
      path: '/notice',
      name: 'notice',
      component: () => import('@/views/NoticePage')
    },
    {
      path: '/bible',
      name: 'bible',
      component: () => import('@/views/BiblePage')
    },
    {
      path: '/dinner',
      component: () => import('@/views/DinnerPage'),
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
      component: () => import('@/views/MemoPage')
    },
    {
      path: '*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundPage')
    }
  ]
})