import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRoute } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'

import { useServiceAvailabilityStore } from '../service_availability'
import { useServiceStore } from '../service'

import { testParams, testState } from '@/test/data'

describe('Service Availability Store', () => {
  vi.mock('vue-router')
  vi.mocked(useRoute).mockReturnValue({ params: testParams.service } as any)

  afterAll(() => {
    vi.restoreAllMocks()
  })

  let serviceAvailabilityStore: ReturnType<typeof useServiceAvailabilityStore>

  describe('initialize', () => {
    beforeEach(() => {
      setActivePinia(createPinia())
      serviceAvailabilityStore = useServiceAvailabilityStore()
    })

    it('initializes the store', () => {
      expect(serviceAvailabilityStore.availabilityData).toBeUndefined()
      expect(serviceAvailabilityStore.changedAvailability).toBe(false)
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      setActivePinia(createPinia())

      const serviceStore = useServiceStore()
      serviceStore.$patch({ ...testState.editServiceStore })

      serviceAvailabilityStore = useServiceAvailabilityStore()
    })

    describe('generateAvailability', () => {
      it('throws error if no service week data is available', () => {
        const serviceStore = useServiceStore()
        serviceStore.$patch({ selectedWeekData: undefined })
        expect(() => serviceAvailabilityStore.generateAvailability()).toThrowError()
      })

      it('generates the availability data', () => {
        expect(serviceAvailabilityStore.availabilityData).toBeUndefined()
        serviceAvailabilityStore.generateAvailability()
        expect(serviceAvailabilityStore.availabilityData).toBeDefined()
      })
    })
  })
})
