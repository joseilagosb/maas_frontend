import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import ServicesView from '../ServicesView.vue'
import ServicesIndex from '@/components/ServicesIndex.vue'

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
    const myAvailableHoursSelector = '[data-testid="my-available-hours"]'

    it('renders available services if its a user', () => {
      expect(wrapper.findComponent(ServicesIndex).exists()).toBe(true)
    })

    it.todo('renders available hours if its a user', () => {
      const myAvailableHoursTitle = wrapper.find(myAvailableHoursSelector).find('h2')
      expect(myAvailableHoursTitle.text()).toEqual('Mis horas disponibles')
    })
  })
})
