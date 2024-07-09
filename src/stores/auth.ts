import axios from 'axios'
import { defineStore } from 'pinia'

type AuthState = {
  isLoggedIn: boolean
}

export const useAuthStore = defineStore({
  id: 'auth',
  state: (): AuthState => ({
    isLoggedIn: false
  }),
  actions: {
    async login(email: string, password: string) {
      return axios
        .post('http://localhost:3000/login', { user: { email, password } })
        .then((response) => {
          if (response.data.accessToken) {
            localStorage.setItem('user', JSON.stringify(response.data))
          }

          this.isLoggedIn = true
          return response.data
        })
        .catch((error: Error) => {
          throw error
        })
    }
  }
})
