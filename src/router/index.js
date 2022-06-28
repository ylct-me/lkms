/**
 * Vuetify Vue CLI Preset
 *
 * router/index.js
 *
 * vue-router documentation: https://router.vuejs.org/
 */

// Imports
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Vue from 'vue'
import Router from 'vue-router'
import goTo from 'vuetify/es5/services/goto'
import { protectedRoute, publicRoute } from './config'
const routes = publicRoute.concat(protectedRoute)

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  scrollBehavior: (to, _, savedPosition) => {
    let scrollTo = 0

    if (to.hash) {
      scrollTo = to.hash
    } else if (savedPosition) {
      scrollTo = savedPosition.y
    }

    return goTo(scrollTo)
  },
  routes: routes,
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  const authRequired = to.matched.some((record) => record.meta.authRequired)
  const isAuthenticated = store.get('auth/isAuthenticated')
  if (authRequired && !isAuthenticated) {
    store.dispatch('snackbar/showSnackbar', {
      text: 'please_login_first',
      color: 'error'
    })
    next({ name: 'Login', query: { redirect: to.name } })
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
