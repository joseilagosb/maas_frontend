import { describe, expect, it, vi, beforeEach } from 'vitest'
import { flushPromises, mount, shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import ServicesIndex from '@/components/services/ServicesIndex.vue'

import { testData, testState } from '@/test/data'
import { getServices } from '@/services/api'

describe('ServicesIndex', () => {
  const errorMessageSelector = '[data-testid="error-message"]'
  const servicesSelector = '[data-testid="services"]'
  const serviceSelector = '[data-testid="service"]'

  beforeEach(() => {
    vi.mocked(getServices).mockImplementation(async () => {
      return Promise.resolve(testData.services)
    })
  })

  it('shows services when the fetch is successful', async () => {
    const wrapper = mount(ServicesIndex, {
      global: {
        plugins: [createTestingPinia({ initialState: { ...testState.user }, stubActions: false })]
      }
    })
    await flushPromises()

    expect(wrapper.find(servicesSelector).exists()).toBe(true)
    expect(wrapper.findAll(serviceSelector).length).toBe(testData.services.length)
  })

  it('shows an error message when the fetch fails', async () => {
    vi.mocked(getServices).mockImplementation(async () => {
      return Promise.reject(new Error('error'))
    })

    const wrapper = shallowMount(ServicesIndex, {
      global: {
        plugins: [createTestingPinia({ initialState: { ...testState.user }, stubActions: false })]
      }
    })

    await flushPromises()

    expect(wrapper.find(errorMessageSelector).exists()).toBe(true)
  })

  describe('when a service is clicked', () => {
    it('opens the service page', async () => {
      const wrapper = shallowMount(ServicesIndex, {
        global: {
          plugins: [createTestingPinia({ initialState: { ...testState.user }, stubActions: false })]
        }
      })

      await flushPromises()

      const firstService = testData.services[0]
      const firstServiceElement = wrapper.findAll(serviceSelector)[0]
      expect(firstServiceElement.html()).toContain(`to="/services/${firstService.id}"`)
    })
  })
})
