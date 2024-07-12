import { useRoute } from 'vue-router'
import { describe, expect, it, vi, beforeEach, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import ServiceView from '../ServiceView.vue'

import { testData, testResponses, testState } from '@/test/data'
import axios from 'axios'

describe('ServiceView', () => {
  vi.mock('vue-router')

  beforeEach(() => {
    vi.resetAllMocks()
  })

  const service = testData.services[0]
  const editAvailabilityButtonSelector = '[data-testid="edit-availability-button"]'

  vi.mocked(useRoute).mockReturnValue({ params: { id: service.id } } as any)

  describe('if its a user', () => {
    const wrapper = mount(ServiceView, {
      global: {
        plugins: [createTestingPinia({ initialState: { ...testState.user }, stubActions: false })]
      }
    })

    it('renders the edit my availability button if its a user', () => {
      expect(wrapper.find(editAvailabilityButtonSelector).exists()).toBe(true)
      const myAvailableHoursTitle = wrapper.find(editAvailabilityButtonSelector).find('span')

      expect(myAvailableHoursTitle.text()).toEqual('Editar mi disponibilidad')
    })
  })
})
