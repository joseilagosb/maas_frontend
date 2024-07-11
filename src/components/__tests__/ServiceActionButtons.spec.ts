import { testState } from '@/test/data'
import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ServiceActionButtons from '../ServiceActionButtons.vue'

describe('ServiceActionButtons', () => {
  it('renders the New Service button when the user is an admin', () => {
    const wrapper = shallowMount(ServiceActionButtons, {
      global: { plugins: [createTestingPinia({ initialState: { ...testState.admin } })] }
    })

    expect(wrapper.find('[data-testid="new-service-button"]').exists()).toBe(true)
  })
})
