import axios from 'axios'
import { defineStore } from 'pinia'

import type { AuthState } from '@/types/stores'
import { NULL_OBJECTS, USER_LOCAL_STORAGE_KEYS } from '@/utils/constants'

const initialAuthState: AuthState = {
  isLoggedIn: false,
  user: NULL_OBJECTS.USER
}

const getDefaultState = () => {
  const userFromLocalStorage = localStorage.getItem(USER_LOCAL_STORAGE_KEYS.USER)
  if (userFromLocalStorage) {
    return { ...initialAuthState, isLoggedIn: true, user: JSON.parse(userFromLocalStorage) }
  }
  return initialAuthState
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => getDefaultState(),
  actions: {
    async login(email: string, password: string) {
      return axios
        .post('http://localhost:3000/login', { user: { email, password } })
        .then((response) => {
          if (response && response.data) {
            const { data, headers } = response
            axios.defaults.headers.common['Authorization'] = headers.authorization

            localStorage.setItem(USER_LOCAL_STORAGE_KEYS.USER, JSON.stringify(response.data.user))

            this.user = data.user
            this.isLoggedIn = true
          }
        })
        .catch((error: Error) => {
          throw error
        })
    },
    async logout() {
      if (!this.isLoggedIn) {
        return
      }

      return axios
        .delete('http://localhost:3000/logout')
        .then((response) => {
          if (response && response.data) {
            localStorage.removeItem(USER_LOCAL_STORAGE_KEYS.USER)
            axios.defaults.headers.common['Authorization'] = ''
            this.user = NULL_OBJECTS.USER
            this.isLoggedIn = false
          }
        })
        .catch((error: Error) => {
          throw error
        })
    }
  }
})
