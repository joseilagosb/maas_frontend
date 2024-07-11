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
  getters: {
    isAdmin: (state: AuthState) => state.user.role === 'admin',
    isUser: (state: AuthState) => state.user.role === 'user'
  },
  actions: {
    async login(email: string, password: string) {
      return axios
        .post('http://localhost:3000/login', { user: { email, password } })
        .then((response) => {
          if (response && response.data) {
            const { data, headers } = response

            localStorage.setItem(USER_LOCAL_STORAGE_KEYS.TOKEN, headers.authorization.split(' ')[1])
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
            localStorage.removeItem(USER_LOCAL_STORAGE_KEYS.TOKEN)
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
