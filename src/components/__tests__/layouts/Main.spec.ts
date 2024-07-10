import { describe, it, expect, vi, afterAll, afterEach } from 'vitest'
import { useRouter } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'

import MainLayout from '@/components/layouts/Main.vue'

import { NULL_OBJECTS } from '@/utils/constants'

const setUseRouterRoute = (routeName: string) => {
  vi.mocked(useRouter).mockReturnValue({
    currentRoute: {
      value: { name: routeName }
    }
  } as any)
}

describe('MainLayout', () => {
  afterEach(() => {
    setUseRouterRoute('home')
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  vi.mock('vue-router')
  setUseRouterRoute('home')

  const loginButtonSelector = '[data-testid="login-button"]'
  const welcomeMessageSelector = '[data-testid="welcome-message"]'

  describe('when the user is not logged in', () => {
    const wrapper = shallowMount(MainLayout, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: { auth: { isLoggedIn: false, user: NULL_OBJECTS.USER } }
          })
        ]
      }
    })

    it('shows login button', () => {
      expect(wrapper.find(loginButtonSelector).text()).toBe('Iniciar sesión')
    })

    it("doesn't show login button when the route is '/login'", () => {
      setUseRouterRoute('login')

      const refreshedWrapper = shallowMount(MainLayout, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: { auth: { isLoggedIn: false, user: NULL_OBJECTS.USER } }
            })
          ]
        }
      })

      expect(refreshedWrapper.find(loginButtonSelector).exists()).toBe(false)
    })
  })

  describe('when the user is logged in', () => {
    const aLoggedInUser = { id: 0, name: 'Cristiano Ronaldo', email: '' }

    it('shows the username', () => {
      const updatedWrapper = shallowMount(MainLayout, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: { auth: { isLoggedIn: true, user: aLoggedInUser } }
            })
          ]
        }
      })
      expect(updatedWrapper.find(loginButtonSelector).exists()).toBe(false)
      expect(updatedWrapper.find(welcomeMessageSelector).text()).toBe(aLoggedInUser.name)
    })
  })
})
