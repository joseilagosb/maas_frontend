import { defineStore } from 'pinia'

import { deleteLogout, postLogin } from '@/services/api'

import { NULL_OBJECTS, USER_LOCAL_STORAGE_KEYS } from '@/utils/constants'

import type { AuthState } from '@/types/stores'

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
      try {
        const user = await postLogin(email, password)
        this.user = user
        this.isLoggedIn = true
      } catch (error) {
        throw error
      }
    },
    async logout() {
      if (!this.isLoggedIn) {
        return
      }

      try {
        await deleteLogout()
        this.user = NULL_OBJECTS.USER
        this.isLoggedIn = false
      } catch (error) {
        throw error
      }
    }
  }
})
