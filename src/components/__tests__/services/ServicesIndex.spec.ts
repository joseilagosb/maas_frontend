import type { ComponentPublicInstance } from 'vue'
import { describe, expect, it, vi, beforeEach, afterAll } from 'vitest'
import { flushPromises, VueWrapper } from '@vue/test-utils'

import ServicesIndex from '@/components/services/ServicesIndex.vue'

import { getServices } from '@/services/api'

import { testData, testState } from '@/test/data'
import { shallowMountWithPinia } from '@/test/utils'
import { useHomeStore } from '@/stores/home'

describe('ServicesIndex', () => {
  let wrapper: VueWrapper<ComponentPublicInstance<typeof ServicesIndex>>

  const errorMessageSelector = '[data-testid="error-message"]'
  const servicesSelector = '[data-testid="services"]'
  const serviceSelector = '[data-testid="service"]'

  describe('setup', () => {
    let wrapper: VueWrapper<ComponentPublicInstance<typeof ServicesIndex>>

    beforeEach(async () => {
      wrapper = shallowMountWithPinia(ServicesIndex, {
        initialState: { auth: testState.userAuthStore },
        stubActions: false
      })
      await flushPromises()
    })

    describe('mounted', () => {
      it('runs the fetchServices action', async () => {
        const homeStore = useHomeStore()
        expect(homeStore.fetchServices).toHaveBeenCalledTimes(1)
      })
    })

    describe('actions', () => {
      describe('fetchServices', () => {
        afterAll(() => {
          vi.mocked(getServices).mockImplementation(async () => {
            return Promise.resolve(testData.services)
          })
        })

        it('renders the services if it succeeds', () => {
          expect(wrapper.find(servicesSelector).exists()).toBe(true)
        })

        it('renders error if it fails', async () => {
          vi.mocked(getServices).mockImplementationOnce(async () => {
            return Promise.reject(new Error('error'))
          })
          const wrapperWithError = shallowMountWithPinia(ServicesIndex, {
            initialState: { auth: testState.userAuthStore },
            stubActions: false
          })
          await flushPromises()

          expect(wrapperWithError.find(errorMessageSelector).exists()).toBe(true)
        })
      })
    })
  })

  describe('render', () => {
    beforeEach(async () => {
      wrapper = shallowMountWithPinia(ServicesIndex, {
        initialState: { auth: testState.userAuthStore },
        stubActions: false
      })
      await flushPromises()
    })

    it('renders the correct number of services', () => {
      expect(wrapper.findAll(serviceSelector).length).toBe(testData.services.length)
    })

    it('renders the correct name for all services', () => {
      wrapper.findAll(serviceSelector).forEach((service, serviceIndex) => {
        const expectedService = testData.services[serviceIndex]
        expect(service.text()).toContain(expectedService.name)
      })
    })

    it('shows the correct router to prop for all services', () => {
      wrapper.findAll(serviceSelector).forEach((service, serviceIndex) => {
        const expectedService = testData.services[serviceIndex]
        expect(service.html()).toContain(`to="/services/${expectedService.id}"`)
      })
    })
  })
})
