import axios from 'axios'

import { defineStore } from 'pinia'

import type { Service } from '@/types/models'
import type { HomeState } from '@/types/stores'

export const useHomeStore = defineStore('home', {
  state: (): HomeState => ({
    services: []
  }),
  actions: {
    async fetchServices() {
      return axios
        .get('http://localhost:3000/services')
        .then((response) => {
          const servicesJson = response.data
          this.services = servicesJson.map((service: any): Service => service.attributes)
        })
        .catch((error: Error) => {
          throw error
        })
    }
  }
})
