import Page from '@/components/layouts/Page.vue'
import { describe, expect, it } from 'vitest'

import { testState } from '@/test/data'

import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'

describe('Page', () => {
  const sidebarSelector = '[data-testid="sidebar"]'
  const contentSelector = '[data-testid="content"]'
  const companiesButtonSelector = '[data-testid="companies-button"]'

  it('renders the sidebar when sidebar slot is provided', () => {
    const wrapper = shallowMount(Page, {
      slots: { sidebar: '<div data-testid="sidebar">sidebar</div>' },
      globals: {
        plugins: [createTestingPinia({ initialState: { ...testState.user } })]
      }
    })

    expect(wrapper.find(sidebarSelector).exists()).toBe(true)
    expect(wrapper.find(sidebarSelector).text()).toBe('sidebar')
  })

  it('stretches the content to the full width when sidebar slot is not provided', () => {
    const wrapper = shallowMount(Page, {
      slots: {},
      globals: {
        plugins: [createTestingPinia({ initialState: { ...testState.user } })]
      }
    })

    expect(wrapper.find(contentSelector).classes()).toContain('w-full')
  })

  describe('when its an admin', () => {
    it('renders the companies button', () => {
      const wrapper = shallowMount(Page, {
        slots: {},
        globals: {
          plugins: [createTestingPinia({ initialState: { ...testState.admin } })]
        }
      })

      expect(wrapper.find(companiesButtonSelector).exists()).toBe(true)
    })
  })
})
