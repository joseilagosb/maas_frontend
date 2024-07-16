import { describe, it, expect, vi, afterEach } from 'vitest'
import { useRoute } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'
import { flushPromises, shallowMount } from '@vue/test-utils'

import ServiceOverview from '../ServiceOverview.vue'

import { getService } from '@/services/api'

import { testData, testState } from '@/test/data'

describe('ServiceOverview', () => {
  vi.mock('vue-router')
  const service = testData.services[0]
  const serviceSelector = '[data-testid="service"]'
  const errorMessageSelector = '[data-testid="error-message"]'

  afterEach(() => {
    vi.mocked(getService).mockImplementation(async () => {
      return Promise.resolve(service)
    })
  })

  it('shows the service when the fetch is successful', async () => {
    vi.mocked(useRoute).mockReturnValue({ params: { id: service.id } } as any)

    const wrapper = shallowMount(ServiceOverview, {
      global: {
        plugins: [createTestingPinia({ initialState: { ...testState.user }, stubActions: false })]
      }
    })

    await flushPromises()

    expect(wrapper.find(serviceSelector).exists()).toBe(true)
  })

  it('shows an error message when the fetch fails', async () => {
    vi.mocked(useRoute).mockReturnValue({ params: { id: service.id } } as any)
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
