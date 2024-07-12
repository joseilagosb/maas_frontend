import { describe, it, expect, vi, afterAll, afterEach } from 'vitest'
import { useRouter } from 'vue-router'

import MainLayout from '@/components/layouts/Main.vue'

import { shallowMountWithPinia } from '@/test/utils'
import { mockUseRouter } from '@/test/mocks/use_router'
import { testState } from '@/test/data'

const setUseRouter = (routeName: string) => {
  vi.mocked(useRouter).mockReturnValue(mockUseRouter(routeName))
}

describe('MainLayout', () => {
  afterEach(() => {
    setUseRouter('home')
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  vi.mock('vue-router')
  setUseRouter('home')

  const loginButtonSelector = '[data-testid="login-button"]'
  const welcomeMessageSelector = '[data-testid="welcome-message"]'

  describe('when the user is not logged in', () => {
    const wrapper = shallowMountWithPinia(MainLayout, {
      initialState: { ...testState.notLoggedIn }
    })

    it('shows login button', () => {
      expect(wrapper.find(loginButtonSelector).text()).toBe('Iniciar sesión')
    })

    it("doesn't show login button when the route is '/login'", () => {
      setUseRouter('login')
      const refreshedWrapper = shallowMountWithPinia(MainLayout, {
        initialState: { ...testState.notLoggedIn }
      })

      expect(refreshedWrapper.find(loginButtonSelector).exists()).toBe(false)
    })
  })

  describe('when the user is logged in', () => {
    const userDropdownSelector = '[data-testid="user-dropdown"]'
    const userSelector = '[data-testid="user-selector"]'

    it('shows the username', () => {
      const updatedWrapper = shallowMountWithPinia(MainLayout, {
        initialState: { ...testState.user }
      })
      expect(updatedWrapper.find(loginButtonSelector).exists()).toBe(false)
      expect(updatedWrapper.find(welcomeMessageSelector).text()).toBe(testState.user.auth.user.name)
    })

    it('displays the user dropdown when the user clicks on the user', async () => {
      const updatedWrapper = shallowMountWithPinia(MainLayout, {
        initialState: { ...testState.user }
      })

      expect(updatedWrapper.find(userDropdownSelector).exists()).toBe(false)
      await updatedWrapper.find(userSelector).trigger('click')
      expect(updatedWrapper.find(userDropdownSelector).exists()).toBe(true)
    })

    it.todo('closes the user dropdown when the user clicks outside of it')

    it('sends back to login when the user clicks on the logout button', async () => {
      const updatedWrapper = shallowMountWithPinia(MainLayout, {
        initialState: { ...testState.user },
        stubActions: false
      })
      const logoutButtonSelector = '[data-testid="logout-button"]'

      await updatedWrapper.find(userSelector).trigger('click')
      await updatedWrapper.find(logoutButtonSelector).trigger('click')

      await updatedWrapper.vm.$nextTick()

      expect(useRouter().push).toHaveBeenCalledWith('/login?redirected=loggedout')
    })
  })
})
