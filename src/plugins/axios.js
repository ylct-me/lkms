import router from '@/router'
import store from '@/store'
import axios from 'axios'
import Vue from 'vue'

axios.defaults.baseURL = process.env.VUE_APP_API_URL || ''
axios.defaults.timeout = 5000
axios.defaults.headers.common['Accept-Language'] = store.get('app/locale') || 'en'
axios.defaults.headers.common['Access-Control-Allow-Origin'] = axios.defaults.baseURL

const err = (error) => {
  if (!error.response) {
    store.dispatch('snackbar/showSnackbar', { text: 'network_error', color: 'error' })
    return Promise.reject(error)
  }
  const { status, data } = error.response
  const { detail } = data
  let message = []
  for (let field of detail) {
    message.push(field.msg)
  }
  switch (status) {
    case 400:
      store.dispatch('snackbar/showSnackbar', { text: detail, color: 'error' })
      break
    case 422:
      store.dispatch('snackbar/showSnackbar', { text: message, color: 'error' })
      break
    case 401:
      store.dispatch('snackbar/showSnackbar', { text: detail, color: 'error' })
      if (error.config && !error.config.__isRetryRequest) {
        store.dispatch('auth/logout')
        router.push({
          name: 'Login',
          query: { redirect: router.currentRoute.name }
        })
      }
      break
    case 403:
      store.dispatch('snackbar/showSnackbar', { text: detail, color: 'error' })
      break
    case 500:
      store.dispatch('snackbar/showSnackbar', { text: 'server_error', color: 'error' })
      break
    default:
      break
  }
  return Promise.reject(error)
}

// request interceptor
axios.interceptors.request.use((config) => {
  const urlsExcludedForBearerHeader = [
    '/auth/jwt/login',
    '/forgot',
    '/auth/register',
    '/reset',
  ]
  if (urlsExcludedForBearerHeader.indexOf(config.url) === -1) {
    config.headers.Authorization = `Bearer ${store.get('auth/token')}`
  }


  // config.headers['Access-Control-Allow-Origin'] = axios.defaults.baseURL
  // config.headers['Content-Type'] = 'application/json'
  // config.headers['Authorization'] = 'Bearer ' + store.get('auth/token')

  return config
}, err)

// response interceptor

axios.interceptors.response.use(({ data, config }) => {
  // console.log(data)
  if (['put', 'post', 'delete', 'patch'].includes(config.method) && data.meta) {
    store.dispatch('snackbar/showSnackbar', { text: data.meta.message, color: 'success' })
  }

  return data
}, err)

Plugin.install = (Vue) => {
  Vue.axios = axios
  window.axios = axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return axios
      }
    },
    $axios: {
      get() {
        return axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
