import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import { testState } from '@/test/data'
import ServicesActionButtons from '@/components/services/ServicesActionButtons.vue'

describe('ServicesActionButtons', () => {
  describe('new service button', () => {
    it('does not render when the user is not an admin', () => {
      const wrapper = shallowMount(ServicesActionButtons, {
        global: { plugins: [createTestingPinia({ initialState: { ...testState.user } })] }
      })

      expect(wrapper.find('[data-testid="new-service-button"]').exists()).toBe(false)
    })

    it('renders when the user is an admin', () => {
      const wrapper = shallowMount(ServicesActionButtons, {
        global: { plugins: [createTestingPinia({ initialState: { ...testState.admin } })] }
      })

      expect(wrapper.find('[data-testid="new-service-button"]').exists()).toBe(true)
    })
  })
})
