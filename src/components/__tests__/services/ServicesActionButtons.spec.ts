import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import { testState } from '@/test/data'
import ServicesActionButtons from '@/components/services/ServicesActionButtons.vue'

describe('ServicesActionButtons', () => {
  it('renders the New Service button when the user is an admin', () => {
    const wrapper = shallowMount(ServicesActionButtons, {
      global: { plugins: [createTestingPinia({ initialState: { ...testState.admin } })] }
    })

    expect(wrapper.find('[data-testid="new-service-button"]').exists()).toBe(true)
  })
})
