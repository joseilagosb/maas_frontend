import type { ComponentPublicInstance } from 'vue'
import { createTestingPinia } from '@pinia/testing'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

import Page from '@/components/layouts/Page.vue'

import { testState } from '@/test/data'

import { shallowMountWithPinia } from '@/test/utils'

describe('Page', () => {
  let wrapper: VueWrapper<ComponentPublicInstance<typeof Page>>

  const sidebarSelector = '[data-testid="sidebar"]'
  const contentSelector = '[data-testid="content"]'
  const companiesButtonSelector = '[data-testid="companies-button"]'

  describe('render', () => {
    describe('when its a user', () => {
      beforeEach(() => {
        wrapper = shallowMountWithPinia(Page, {
          initialState: { auth: testState.userAuthStore }
        })
      })

      it('renders the sidebar when sidebar slot is provided', () => {
        wrapper = shallowMount(Page, {
          slots: { sidebar: '<div data-testid="sidebar">sidebar</div>' },
          globals: {
            plugins: [createTestingPinia({ initialState: { auth: testState.userAuthStore } })]
          }
        }) as VueWrapper<ComponentPublicInstance<typeof Page>>

        expect(wrapper.find(sidebarSelector).exists()).toBe(true)
        expect(wrapper.find(sidebarSelector).text()).toBe('sidebar')
      })

      it('stretches the content to the full width when sidebar slot is not provided', () => {
        expect(wrapper.find(contentSelector).classes()).toContain('w-full')
      })
    })

    describe('when its an admin', () => {
      beforeEach(() => {
        wrapper = shallowMountWithPinia(Page, {
          initialState: { auth: testState.adminAuthStore }
        })
      })

      it('renders the companies button', () => {
        expect(wrapper.find(companiesButtonSelector).exists()).toBe(true)
      })
    })
  })
})
