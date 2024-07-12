import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import { USER_LOCAL_STORAGE_KEYS } from './utils/constants'
import { createI18n } from 'vue-i18n'

const app = createApp(App)

const i18n = createI18n({
  locale: 'es'
})

app.use(createPinia())
app.use(router)
app.use(i18n)

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

app.mount('#app')
