import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRoute } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'

import { useServiceAvailabilityStore } from '../service_availability'
import { useServiceStore } from '../service'

import { testState, testTime } from '@/test/data'

describe('Service Availability Store', () => {
  vi.mock('vue-router')
  vi.mocked(useRoute).mockReturnValue({ params: { week: testTime.week } } as any)

  afterAll(() => {
    vi.restoreAllMocks()
  })

  let serviceAvailabilityStore: ReturnType<typeof useServiceAvailabilityStore>

  beforeEach(() => {
    setActivePinia(createPinia())

    const serviceStore = useServiceStore()
    serviceStore.$patch({ ...testState.editServiceStore })

    serviceAvailabilityStore = useServiceAvailabilityStore()
  })

  describe('initialize', () => {
    it('initializes the store', () => {
      expect(serviceAvailabilityStore.availabilityData).toBeUndefined()
      expect(serviceAvailabilityStore.changedAvailability).toBe(false)
    })
  })

  describe('generateAvailability', () => {
    it('generates the availability data', () => {
      expect(serviceAvailabilityStore.availabilityData).toBeUndefined()
      serviceAvailabilityStore.generateAvailability()
      expect(serviceAvailabilityStore.availabilityData).toBeDefined()
    })
  })
})
