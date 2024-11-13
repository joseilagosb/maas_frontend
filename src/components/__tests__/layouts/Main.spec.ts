import type { ComponentPublicInstance } from 'vue'
import { type VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, afterAll, beforeEach } from 'vitest'
import { useRouter } from 'vue-router'

import MainLayout from '@/components/layouts/Main.vue'

import { setUseRouterMock, shallowMountWithPinia } from '@/test/utils'
import { testState } from '@/test/data'

describe('MainLayout', () => {
  let wrapper: VueWrapper<ComponentPublicInstance<typeof MainLayout>>
  vi.mock('vue-router')

  afterAll(() => {
    vi.restoreAllMocks()
  })

  const loginButtonSelector = '[data-testid="login-button"]'
  const welcomeMessageSelector = '[data-testid="welcome-message"]'

  describe('render', () => {
    describe('when the user is not logged in', () => {
      beforeEach(() => {
        setUseRouterMock('home')
        wrapper = shallowMountWithPinia(MainLayout, {
          initialState: { auth: testState.notLoggedInAuthStore }
        })
      })

      it('shows login button', () => {
        expect(wrapper.find(loginButtonSelector).text()).toBe('Iniciar sesión')
      })

      it("doesn't show login button when the route is '/login'", () => {
        setUseRouterMock('login')
        wrapper = shallowMountWithPinia(MainLayout, {
          initialState: { auth: testState.notLoggedInAuthStore }
        })

        expect(wrapper.find(loginButtonSelector).exists()).toBe(false)
      })
    })

    describe('when the user is logged in', () => {
      const userSelector = '[data-testid="user-selector"]'
      const userDropdownContainerSelector = '[data-testid="user-dropdown-container"]'
      const userDropdownSelector = '[data-testid="user-dropdown"]'

      beforeEach(() => {
        setUseRouterMock('home')
        wrapper = shallowMountWithPinia(MainLayout, {
          initialState: { auth: testState.userAuthStore },
          stubActions: false
        })
      })

      it('shows the username from the user auth store', () => {
        const expectedUser = testState.userAuthStore.user

        expect(wrapper.find(loginButtonSelector).exists()).toBe(false)
        expect(wrapper.find(welcomeMessageSelector).text()).toBe(expectedUser.name)
      })

      it('displays the user dropdown when the user clicks on the user', async () => {
        expect(wrapper.find(userDropdownContainerSelector).classes()).toContain(
          'pointer-events-none'
        )
        expect(wrapper.find(userDropdownSelector).classes()).toContain('-translate-y-32')

        await wrapper.find(userSelector).trigger('click')

        expect(wrapper.find(userDropdownContainerSelector).classes()).toContain(
          'pointer-events-auto'
        )
        expect(wrapper.find(userDropdownSelector).classes()).toContain('translate-y-0')
      })

      it('closes the user dropdown when the user clicks outside of it', async () => {
        await wrapper.find(userSelector).trigger('click')

        expect(wrapper.find(userDropdownContainerSelector).classes()).toContain(
          'pointer-events-auto'
        )
        expect(wrapper.find(userDropdownSelector).classes()).toContain('translate-y-0')

        window.dispatchEvent(new MouseEvent('click'))

        await wrapper.vm.$nextTick()

        expect(wrapper.find(userDropdownContainerSelector).classes()).toContain(
          'pointer-events-none'
        )
        expect(wrapper.find(userDropdownSelector).classes()).toContain('-translate-y-32')
      })

      it('sends back to login when the user clicks on the logout button', async () => {
        const logoutButtonSelector = '[data-testid="logout-button"]'

        await wrapper.find(userSelector).trigger('click')
        await wrapper.find(logoutButtonSelector).trigger('click')

        await wrapper.vm.$nextTick()

        expect(useRouter().push).toHaveBeenCalledWith('/login?redirected=loggedout')
      })
    })
  })
})
