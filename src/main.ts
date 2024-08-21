import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import { USER_LOCAL_STORAGE_KEYS } from './utils/constants'

const app = createApp(App)

app.use(router)

const pinia = createPinia()
app.use(pinia)

axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem(USER_LOCAL_STORAGE_KEYS.TOKEN)
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function (response) {
    return Promise.resolve(response)
  },
  function (error) {
    if (error.response.status === 401) {
      localStorage.removeItem(USER_LOCAL_STORAGE_KEYS.TOKEN)
      localStorage.removeItem(USER_LOCAL_STORAGE_KEYS.USER)
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

app.mount('#app')
