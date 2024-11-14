import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import ServicesView from '../ServicesView.vue'
import ServicesIndex from '@/components/services/ServicesIndex.vue'

import { testData } from '@/test/data'

describe('ServicesView', () => {
  describe('if its a user', () => {
    const wrapper = mount(ServicesView, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              auth: { isLoggedIn: true, user: testData.user },
              home: { services: [] }
            },
            stubActions: false
          })
        ]
      }
    })

    it('renders available services if its a user', () => {
      expect(wrapper.findComponent(ServicesIndex).exists()).toBe(true)
    })
  })
})
