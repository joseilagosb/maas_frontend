import { shallowMountWithPinia } from '@/test/utils'
import { describe, expect, it, vi } from 'vitest'

import ServicesView from '../ServicesView.vue'
import ServicesIndex from '@/components/ServicesIndex.vue'

import { testData } from '@/test/data'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

describe('ServicesView', () => {
  const myAvailableHoursSelector = '[data-testid="my-available-hours"]'

  it('renders available services if its a user', () => {
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
    const myAvailableHoursTitle = wrapper.find(myAvailableHoursSelector).find('h2')

    expect(wrapper.findComponent(ServicesIndex).exists()).toBe(true)
    expect(myAvailableHoursTitle.text()).toEqual('Mis horas disponibles')
  })
})
