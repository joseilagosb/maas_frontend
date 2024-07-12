import { createPinia } from 'pinia'
import { it, expect, describe, beforeEach } from 'vitest'

import { useServiceStore } from '../service'
import { testData } from '@/test/data'

describe('Service Store', () => {
  let serviceStore: ReturnType<typeof useServiceStore>

  beforeEach(() => {
    serviceStore = useServiceStore(createPinia())
    serviceStore.$patch({ service: undefined })
  })

  describe('fetchService', () => {
    it('fetches a service', async () => {
      const service = testData.services[0]

      await serviceStore.fetchService(service.id)

      expect(serviceStore.service).toEqual(service)
    })
  })
})
