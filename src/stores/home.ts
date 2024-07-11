import type { HomeState } from '@/types/stores'
import axios from 'axios'
import { defineStore } from 'pinia'

export const useHomeStore = defineStore('home', {
  state: (): HomeState => ({
    services: []
  }),
  actions: {
    async fetchServices() {
      return axios
        .get('http://localhost:3000/services')
        .then((response) => {
          this.services = response.data
        })
        .catch((error: Error) => {
          throw error
        })
    }
  }
})
