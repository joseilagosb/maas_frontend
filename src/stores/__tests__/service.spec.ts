import { createPinia } from 'pinia'
import { useRoute } from 'vue-router'
import { it, expect, describe, vi, beforeEach } from 'vitest'

import { useServiceStore } from '../service'
import { testData, testParams, testState, testTime } from '@/test/data'
import { getServiceWeek } from '@/services/api'

describe('Service Store', () => {
  let serviceStore: ReturnType<typeof useServiceStore>
  vi.mock('vue-router')

  describe('initialize', () => {
    it('initializes the store', () => {
      vi.mocked(useRoute).mockReturnValue({
        params: { ...testParams.service, week: undefined }
      } as any)
      serviceStore = useServiceStore(createPinia())

      expect(serviceStore.service).toBeUndefined()
      expect(serviceStore.userAssignedHours).toEqual([])
      expect(serviceStore.activeWeeks).toEqual([])
      expect(serviceStore.selectedWeek).toEqual(testTime.week)
      expect(serviceStore.selectedServiceId).toEqual(testData.service.id)
      expect(serviceStore.selectedWeekData).toBeUndefined()
    })

    it('initializes the selected week on a different week', () => {
      const previousWeek = testTime.week - 1
      vi.mocked(useRoute).mockReturnValue({
        params: { ...testParams.service, week: previousWeek }
      } as any)
      serviceStore = useServiceStore(createPinia())

      expect(serviceStore.selectedWeek).toEqual(previousWeek)
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      vi.mocked(useRoute).mockReturnValue({ params: testParams.service } as any)
      serviceStore = useServiceStore(createPinia())
    })

    describe('fetchService', () => {
      beforeEach(async () => {
        await serviceStore.fetchService()
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

    describe('fetchUserAssignedHours', () => {
      it.todo('fetches the user assigned hours')
    })

    describe('fetchServiceWeek', () => {
      describe('show mode', () => {
        beforeEach(async () => {
          await serviceStore.fetchServiceWeek('show')
        })

        it('fetches to api show route', async () => {
          expect(getServiceWeek).toHaveBeenCalledWith(testData.service.id, testTime.week, 'show')
        })

        it('fetches the service week', () => {
          const { selectedWeekData } = testState.showServiceStore
          expect(serviceStore.selectedWeekData).toBeDefined()
          expect(serviceStore.selectedWeekData).toEqual(selectedWeekData)
        })
      })

      describe('edit mode', () => {
        beforeEach(async () => {
          await serviceStore.fetchServiceWeek('edit')
        })

        it('fetches to api edit route', async () => {
          expect(getServiceWeek).toHaveBeenCalledWith(testData.service.id, testTime.week, 'edit')
        })

        it('fetches the service week', async () => {
          expect(serviceStore.selectedWeekData).toBeDefined()
          expect(serviceStore.selectedWeekData).toEqual(testState.editServiceStore.selectedWeekData)
        })
      })
    })

    describe('generateEmptyServiceWeek', () => {
      it('throws error if no service is available', () => {
        serviceStore.$patch({ service: undefined })
        expect(() => serviceStore.generateEmptyServiceWeek()).toThrowError()
      })

      it('generates an empty service week', () => {
        serviceStore.$patch({ service: testState.serviceStore.service })
        serviceStore.generateEmptyServiceWeek()

        expect(serviceStore.selectedWeekData).toBeDefined()
        expect(serviceStore.selectedWeekData).toEqual(testState.emptyServiceWeekData)
      })
    })
  })
})
