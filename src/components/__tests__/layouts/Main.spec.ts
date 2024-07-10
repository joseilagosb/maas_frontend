import { describe, it, expect, vi, afterAll, afterEach } from 'vitest'
import { useRouter } from 'vue-router'

import MainLayout from '@/components/layouts/Main.vue'

import { NULL_OBJECTS } from '@/utils/constants'
import { shallowMountWithPinia } from '@/test/utils'
import { mockUseRouter } from '@/test/mocks/use_router'

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
      initialState: { auth: { isLoggedIn: false, user: NULL_OBJECTS.USER } }
    })

    it('shows login button', () => {
      expect(wrapper.find(loginButtonSelector).text()).toBe('Iniciar sesión')
    })

    it("doesn't show login button when the route is '/login'", () => {
      setUseRouter('login')
      const refreshedWrapper = shallowMountWithPinia(MainLayout, {
        initialState: { auth: { isLoggedIn: false, user: NULL_OBJECTS.USER } }
      })

      expect(refreshedWrapper.find(loginButtonSelector).exists()).toBe(false)
    })
  })

  describe('when the user is logged in', () => {
    const aLoggedInUser = { id: 0, name: 'Cristiano Ronaldo', email: 'cristiano@maas.com' }
    const initialLoggedInState = { auth: { isLoggedIn: true, user: aLoggedInUser } }

    const userDropdownSelector = '[data-testid="user-dropdown"]'
    const userSelector = '[data-testid="user-selector"]'

    it('shows the username', () => {
      const updatedWrapper = shallowMountWithPinia(MainLayout, {
        initialState: initialLoggedInState
      })
      expect(updatedWrapper.find(loginButtonSelector).exists()).toBe(false)
      expect(updatedWrapper.find(welcomeMessageSelector).text()).toBe(aLoggedInUser.name)
    })

    it('displays the user dropdown when the user clicks on the user', async () => {
      const updatedWrapper = shallowMountWithPinia(MainLayout, {
        initialState: initialLoggedInState
      })

      expect(updatedWrapper.find(userDropdownSelector).exists()).toBe(false)
      await updatedWrapper.find(userSelector).trigger('click')
      expect(updatedWrapper.find(userDropdownSelector).exists()).toBe(true)
    })

    it.todo('closes the user dropdown when the user clicks outside of it')

    it('logs out when the user clicks on the logout button', async () => {
      const updatedWrapper = shallowMountWithPinia(MainLayout, {
        initialState: initialLoggedInState,
        stubActions: false
      })
      const logoutButtonSelector = '[data-testid="logout-button"]'

      await updatedWrapper.find(userSelector).trigger('click')
      await updatedWrapper.find(logoutButtonSelector).trigger('click')

      expect(useRouter().push).toHaveBeenCalledWith('/login?redirected=loggedout')
    })
  })
})
