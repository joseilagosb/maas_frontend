import type { ServiceState } from '@/types/stores'
import axios from 'axios'
import { defineStore } from 'pinia'

export const useServiceStore = defineStore('service', {
  state: (): ServiceState => ({
    service: undefined
  }),
  actions: {
    async fetchService(id: number) {
      return axios
        .get(`http://localhost:3000/services/${id}`)
        .then((response) => {
          const serviceJson = response.data
          this.service = serviceJson.attributes
        })
        .catch((error: Error) => {
          throw error
        })
    }
  }
})
