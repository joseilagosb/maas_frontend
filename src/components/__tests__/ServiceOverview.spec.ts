import type { ComponentPublicInstance } from 'vue'
import { describe, it, expect, vi, afterAll } from 'vitest'
import { useRoute } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'
import { flushPromises, shallowMount, VueWrapper } from '@vue/test-utils'

import ServiceOverview from '../ServiceOverview.vue'

import { getService } from '@/services/api'

import { testData, testState } from '@/test/data'

describe('ServiceOverview', () => {
  vi.mock('vue-router')
  const service = testData.services[0]
  const serviceSelector = '[data-testid="service"]'
  const errorMessageSelector = '[data-testid="error-message"]'

  vi.mocked(useRoute).mockReturnValue({ params: { id: service.id } } as any)

  describe('initial services fetch', () => {
    afterAll(() => {
      vi.restoreAllMocks()
    })

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
      vi.mocked(getService).mockImplementation(async () => {
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
    const wrapper = shallowMount(ServiceOverview, {
      global: {
        plugins: [createTestingPinia({ initialState: { ...testState.user }, stubActions: false })]
      }
    }) as VueWrapper<ComponentPublicInstance<typeof ServiceOverview>>
    const weekSelectSelector = '[data-testid="week-select"]'

    it('exists', () => {
      expect(wrapper.find(weekSelectSelector).exists()).toBe(true)
    })

    it('has the correct weeks', () => {
      const weekOptions = wrapper.find(weekSelectSelector).findAll('option')
      const weekOptionsFromComponent = wrapper.vm.weekOptions
      expect(weekOptions.map((weekOption) => +weekOption.element.value)).toEqual(
        weekOptionsFromComponent
      )
    })

    it.todo('does not show a previous week not contained in active weeks')
    it.todo('shows five weeks in the future')
    it.todo('changes the route when a week is selected')
    it.todo('renders the correct text in the options')
  })

  describe('selected week range text', () => {
    const selectedWeekRangeTextSelector = '[data-testid="selected-week-range-text"]'

    it.todo('exists')
    it.todo('renders with the correct text')
  })

  describe('assigned hours count', () => {
    const assignedHoursCountSelector = '[data-testid="assigned-hours-count"]'

    it.todo('exists')
    it.todo('renders the correct users count')
    it.todo('shows the number of unassigned hours')
  })
})
