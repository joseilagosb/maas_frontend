import axios from 'axios'
import { describe, expect, it, vi, afterEach } from 'vitest'
import { flushPromises, mount, shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import ServicesIndex from '../ServicesIndex.vue'

import { testData, testState } from '@/test/data'

describe('ServicesIndex', () => {
  const errorMessageSelector = '[data-testid="error-message"]'
  const servicesSelector = '[data-testid="services"]'
  const serviceSelector = '[data-testid="service"]'

  vi.mock('axios')
  vi.mock('vue-router')

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows services when the fetch is successful', async () => {
    vi.mocked(axios.get).mockImplementation(async (url) => {
      if (url === 'http://localhost:3000/services') {
        return Promise.resolve({ data: testData.services })
      }
    })
    const wrapper = mount(ServicesIndex, {
      global: {
        plugins: [createTestingPinia({ initialState: { ...testState.user }, stubActions: false })]
      }
    })
    await flushPromises()

    expect(wrapper.find(servicesSelector).exists()).toBe(true)
    expect(wrapper.findAll(serviceSelector).length).toBe(2)
  })

  it('shows an error message when the fetch fails', async () => {
    vi.mocked(axios.get).mockImplementation(async (url) => {
      if (url === 'http://localhost:3000/services') {
        return Promise.reject(new Error('error'))
      }
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
      vi.mocked(axios.get).mockImplementation(async (url) => {
        if (url === 'http://localhost:3000/services') {
          return Promise.resolve({ data: testData.services })
        }
      })

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
