import { describe, expect, it } from 'vitest'

import ServicesActionButtons from '@/components/services/ServicesActionButtons.vue'

import { testState } from '@/test/data'
import { shallowMountWithPinia } from '@/test/utils'

describe('ServicesActionButtons', () => {
  const newServiceButtonSelector = '[data-testid="new-service-button"]'

  describe('new service button', () => {
    it('does not render when the user is not an admin', () => {
      const wrapper = shallowMountWithPinia(ServicesActionButtons, {
        initialState: { auth: testState.userAuthStore }
      })

      expect(wrapper.find(newServiceButtonSelector).exists()).toBe(false)
    })

    it('renders when the user is an admin', () => {
      const wrapper = shallowMountWithPinia(ServicesActionButtons, {
        initialState: { auth: testState.adminAuthStore }
      })

      expect(wrapper.find(newServiceButtonSelector).exists()).toBe(true)
    })
  })
})
