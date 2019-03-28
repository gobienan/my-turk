import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'

import Overview from './views/Overview.vue'
import Settings from './views/Settings.vue'
import Workers from './views/Workers.vue'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  routes: [{
      path: '/',
      name: 'login',
      component: Login,
      props: true,
      meta: {
        guest: true,
      },
    },
    {
      path: '/overview',
      name: 'overview',
      component: Overview,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/workers',
      name: 'workers',
      component: Workers,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
  ],
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('token') === null) {
      next({
        path: '/',
        params: { nextUrl: to.fullPath },
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
