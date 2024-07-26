import { createPinia } from 'pinia'
import { useRoute } from 'vue-router'
import { it, expect, describe, vi, beforeAll, afterEach } from 'vitest'

import { useServiceStore } from '../service'
import { testData, testState, testTime } from '@/test/data'
import { getServiceWeek } from '@/services/api'

describe('Service Store', () => {
  const service = testData.services[0]
  let serviceStore: ReturnType<typeof useServiceStore>
  vi.mock('vue-router')

  describe('initialize', () => {
    afterEach(() => {
      vi.mocked(useRoute).mockReturnValue({ params: { week: testTime.week } } as any)
      serviceStore = useServiceStore(createPinia())
    })

    it('initializes the store', () => {
      vi.mocked(useRoute).mockReturnValue({ params: { week: undefined } } as any)
      serviceStore = useServiceStore(createPinia())

      expect(serviceStore.service).toBeUndefined()
      expect(serviceStore.users).toEqual([])
      expect(serviceStore.activeWeeks).toEqual([])
      expect(serviceStore.selectedWeek).toEqual(testTime.week)
      expect(serviceStore.selectedWeekData).toBeUndefined()
    })

    it('initializes the selected week on a different week', () => {
      const previousWeek = testTime.week - 1
      vi.mocked(useRoute).mockReturnValue({ params: { week: previousWeek } } as any)
      serviceStore = useServiceStore(createPinia())

      expect(serviceStore.selectedWeek).toEqual(previousWeek)
    })
  })

  describe('fetchService', () => {
    vi.mocked(useRoute).mockReturnValue({ params: { week: testTime.week } } as any)
    serviceStore = useServiceStore(createPinia())

    beforeAll(async () => {
      await serviceStore.fetchService(service.id)
    })

    it('fetches the service', () => {
      expect(serviceStore.service).toBeDefined()
      expect(serviceStore.service).toEqual(testState.serviceStore.service)
    })

    it('generates the activeWeeks array', () => {
      expect(serviceStore.activeWeeks).toBeDefined()
      expect(serviceStore.activeWeeks).toEqual(testState.serviceStore.activeWeeks)
    })
  })

  describe('fetchUsers', () => {
    it.todo('fetches the users')
  })

  describe('fetchServiceWeek', () => {
    describe('show mode', () => {
      beforeAll(async () => {
        await serviceStore.fetchServiceWeek(service.id, testTime.week, 'show')
      })

      it('fetches to api show route', async () => {
        expect(getServiceWeek).toHaveBeenCalledWith(service.id, testTime.week, 'show')
      })

      it('fetches the service week', () => {
        const { selectedWeekData } = testState.showServiceStore
        expect(serviceStore.selectedWeekData).toBeDefined()
        expect(serviceStore.selectedWeekData).toEqual(selectedWeekData)
      })
    })

    describe('edit mode', () => {
      beforeAll(async () => {
        await serviceStore.fetchServiceWeek(testData.services[0].id, testTime.week, 'edit')
      })

      it('fetches to api edit route', async () => {
        expect(getServiceWeek).toHaveBeenCalledWith(testData.services[0].id, testTime.week, 'edit')
      })

      it('fetches the service week', () => {
        const { selectedWeekData } = testState.editServiceStore
        expect(serviceStore.selectedWeekData).toBeDefined()
        expect(serviceStore.selectedWeekData).toEqual(selectedWeekData)
      })
    })
  })

  describe('generateEmptyServiceWeek', () => {
    it('generates an empty service week', () => {
      const serviceStore = useServiceStore()
      serviceStore.generateEmptyServiceWeek()
      expect(serviceStore.selectedWeekData).toBeDefined()
      expect(serviceStore.selectedWeekData).toEqual(testState.emptyServiceWeekData)
    })
  })
})
