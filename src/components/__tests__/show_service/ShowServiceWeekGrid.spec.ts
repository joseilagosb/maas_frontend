import type { ComponentPublicInstance } from 'vue'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { useRoute } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'
import { flushPromises, shallowMount, VueWrapper } from '@vue/test-utils'

import ShowServiceWeekGrid from '@/components/show_service/ShowServiceWeekGrid.vue'

import { useServiceStore } from '@/stores/service'

import { getServiceWeek } from '@/services/api'

import { testData, testState, testTime } from '@/test/data'
import { mockAPIService } from '@/test/mocks/services/api'

describe('ShowServiceWeekGrid', () => {
  vi.mock('vue-router')
  vi.mocked(useRoute).mockReturnValue({ params: { week: testTime.week } } as any)

  afterAll(() => {
    vi.restoreAllMocks()
  })

  const gridSelector = '[data-testid="grid"]'
  const errorMessageSelector = '[data-testid="error-message"]'

  describe('mounted', () => {
    it('fetches when it contains active weeks', async () => {
      const serviceStoreWithWeekData = testState.serviceStore
      shallowMount(ShowServiceWeekGrid, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: { ...testState.user, service: serviceStoreWithWeekData },
              stubActions: false
            })
          ]
        }
      }) as VueWrapper<ComponentPublicInstance<typeof ShowServiceWeekGrid>>

      await flushPromises()

      const serviceStore = useServiceStore()
      expect(serviceStore.generateEmptyServiceWeek).toHaveBeenCalledTimes(0)
      expect(serviceStore.fetchServiceWeek).toHaveBeenCalledTimes(1)
    })

    it('does not fetch when it does not contain active weeks', async () => {
      const serviceStoreWithoutWeekData = {
        ...testState.serviceStore,
        activeWeeks: testData.serviceWeeksWithoutCurrentWeek.map(
          (serviceWeek: any) => serviceWeek.week
        )
      }

      shallowMount(ShowServiceWeekGrid, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: { ...testState.user, service: { ...serviceStoreWithoutWeekData } },
              stubActions: false
            })
          ]
        }
      }) as VueWrapper<ComponentPublicInstance<typeof ShowServiceWeekGrid>>

      await flushPromises()

      const serviceStore = useServiceStore()
      expect(serviceStore.generateEmptyServiceWeek).toHaveBeenCalledTimes(1)
      expect(serviceStore.fetchServiceWeek).toHaveBeenCalledTimes(0)
    })
  })

  describe('initial service week fetch', () => {
    afterAll(() => {
      vi.mocked(getServiceWeek).mockImplementation(mockAPIService.getServiceWeek)
    })

    it('shows the service week when the fetch is successful', async () => {
      const wrapper = shallowMount(ShowServiceWeekGrid, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: { ...testState.user, service: { ...testState.serviceStore } },
              stubActions: false
            })
          ]
        }
      })
      await flushPromises()

      expect(wrapper.find(gridSelector).exists()).toBe(true)
    })

    it('shows an error message when the fetch fails', async () => {
      vi.mocked(getServiceWeek).mockImplementation(async () => {
        return Promise.reject(new Error('error'))
      })
      const wrapper = shallowMount(ShowServiceWeekGrid, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: { ...testState.user, service: { ...testState.showServiceStore } },
              stubActions: false
            })
          ]
        }
      })
      await flushPromises()

      expect(wrapper.find(errorMessageSelector).exists()).toBe(true)
    })
  })
})
