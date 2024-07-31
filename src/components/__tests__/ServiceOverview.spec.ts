import type { ComponentPublicInstance } from 'vue'
import { describe, it, expect, vi, afterAll, beforeEach } from 'vitest'
import { useRoute, useRouter } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'
import { flushPromises, shallowMount, VueWrapper } from '@vue/test-utils'

import ServiceOverview from '../ServiceOverview.vue'

import { useServiceStore } from '@/stores/service'

import { getService } from '@/services/api'
import { formatDate } from '@/services/date'

import { testData, testState, testTime } from '@/test/data'

import { mockDateService } from '@/test/mocks/services/date'

describe('ServiceOverview', () => {
  vi.mock('vue-router')

  const serviceSelector = '[data-testid="service"]'
  const errorMessageSelector = '[data-testid="error-message"]'

  vi.mocked(useRoute).mockReturnValue({ params: { id: testData.service.id } } as any)
  vi.mocked(useRouter).mockReturnValue({ replace: vi.fn() } as any)

  afterAll(() => {
    vi.restoreAllMocks()
  })

  describe('initial services fetch', () => {
    it('shows the service when the fetch is successful', async () => {
      const wrapper = shallowMount(ServiceOverview, {
        global: {
          plugins: [createTestingPinia({ initialState: { ...testState.user }, stubActions: false })]
        }
      })

      await flushPromises()

      expect(wrapper.find(serviceSelector).exists()).toBe(true)
    })

    it('shows an error message when the fetch fails', async () => {
      vi.mocked(getService).mockImplementationOnce(async () => {
        return Promise.reject(new Error('error'))
      })

      const wrapper = shallowMount(ServiceOverview, {
        global: {
          plugins: [createTestingPinia({ initialState: { ...testState.user }, stubActions: false })]
        }
      })

      await flushPromises()

      expect(wrapper.find(errorMessageSelector).exists()).toBe(true)
    })
  })

  describe('week selector', () => {
    let wrapper: VueWrapper<ComponentPublicInstance<typeof ServiceOverview>>

    beforeEach(async () => {
      wrapper = shallowMount(ServiceOverview, {
        global: {
          plugins: [createTestingPinia({ initialState: { ...testState.user }, stubActions: false })]
        }
      }) as VueWrapper<ComponentPublicInstance<typeof ServiceOverview>>
      await flushPromises()
    })

    const weekSelectSelector = '[data-testid="week-select"]'

    it('exists', () => {
      expect(wrapper.find(weekSelectSelector).exists()).toBe(true)
    })

    it('has the correct weeks', () => {
      const weekOptions = wrapper.find(weekSelectSelector).findAll('option')
      const weekOptionsFromComponentState = wrapper.vm.weekOptions
      expect(weekOptions.map((weekOption) => +weekOption.element.value)).toEqual(
        weekOptionsFromComponentState
      )
    })

    it('shows five weeks in the future', () => {
      const weekOptions = wrapper.find(weekSelectSelector).findAll('option').slice(-5)
      const serviceStore = useServiceStore()

      for (const weekOption of weekOptions) {
        expect(serviceStore.activeWeeks).not.toContain(+weekOption.element.value)
      }
    })

    it('renders the correct text in the options', () => {
      const weekOptions = wrapper.find(weekSelectSelector).findAll('option')
      const weekOptionsFromComponentState = wrapper.vm.weekOptions

      for (let i = 0; i < weekOptions.length; i++) {
        const weekOption = weekOptions[i]
        expect(weekOption.element.text).toEqual(
          `Semana ${weekOptionsFromComponentState[i]} del ${testTime.year}`
        )
      }
    })

    it('changes the route when a week is selected', async () => {
      const weekSelect = wrapper.find(weekSelectSelector)
      const firstOption = weekSelect.findAll('option')[0]
      const router = useRouter()

      await weekSelect.setValue(firstOption.element.value)

      expect(router.replace).toHaveBeenCalledWith({ params: { week: +firstOption.element.value } })
    })
  })

  describe('selected week range text', () => {
    let wrapper: VueWrapper<ComponentPublicInstance<typeof ServiceOverview>>

    beforeEach(async () => {
      vi.mocked(formatDate)
        .mockImplementationOnce(() => testTime.date.firstDayOfWeek)
        .mockImplementationOnce(() => testTime.date.lastDayOfWeek)
      wrapper = shallowMount(ServiceOverview, {
        global: {
          plugins: [createTestingPinia({ initialState: { ...testState.user }, stubActions: false })]
        }
      }) as VueWrapper<ComponentPublicInstance<typeof ServiceOverview>>
      await flushPromises()
    })

    afterAll(() => {
      vi.mocked(formatDate).mockImplementation(mockDateService.formatDate)
    })

    const selectedWeekRangeTextSelector = '[data-testid="selected-week-range-text"]'

    it('exists', () => {
      expect(wrapper.find(selectedWeekRangeTextSelector).exists()).toBe(true)
    })

    it('renders with the correct text', () => {
      const selectedWeekRangeText = wrapper.find(selectedWeekRangeTextSelector).text()

      expect(selectedWeekRangeText).toEqual(
        `del ${testTime.date.firstDayOfWeek} al ${testTime.date.lastDayOfWeek}`
      )
    })
  })

  describe('assigned hours count', () => {
    const assignedHoursCountSelector = '[data-testid="assigned-hours-count"]'

    it.todo('exists')
    it.todo('renders the correct users count')
    it.todo('shows the number of unassigned hours')
  })
})
