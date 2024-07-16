import { defineStore } from 'pinia'

import type { HomeState } from '@/types/stores'

import { getServices } from '@/services/api'

export const useHomeStore = defineStore('home', {
  state: (): HomeState => ({
    services: []
  }),
  actions: {
    async fetchServices() {
      try {
        const services = await getServices()
        this.services = services
      } catch (error) {
        throw error
      }
    }
  }
})
