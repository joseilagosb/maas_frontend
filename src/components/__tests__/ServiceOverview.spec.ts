import axios from 'axios'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useRoute } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'
import { flushPromises, shallowMount } from '@vue/test-utils'

import { testData, testState } from '@/test/data'
import ServiceOverview from '../ServiceOverview.vue'
import dayjs from 'dayjs'

describe('ServiceOverview', () => {
  vi.mock('vue-router')
  const service = testData.services[0]
  const serviceSelector = '[data-testid="service"]'
  const errorMessageSelector = '[data-testid="error-message"]'

  afterEach(() => {
    vi.restoreAllMocks()
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
    vi.mocked(dayjs).mockImplementation(
      () =>
        ({
          week: vi.fn().mockReturnValue(10)
        }) as any
    )
    vi.mocked(useRoute).mockReturnValue({ params: { id: service.id } } as any)
    vi.mocked(axios.get).mockImplementation(async (url) => {
      if (url === `http://localhost:3000/services/${service.id}`) {
        return Promise.reject(new Error('error'))
      }
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
