import { describe } from 'node:test'
import { beforeAll, expect, it } from 'vitest'

import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import { useAuthStore } from '@/stores/auth'

import App from '@/App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { checkIfNotLoggedIn, routes } from '..'

const mockRouter = createRouter({
  history: createWebHistory(),
  routes: routes
})
mockRouter.beforeEach(checkIfNotLoggedIn)

describe('router', async () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let wrapper: ReturnType<typeof shallowMount>

  beforeAll(() => {
    pinia = createTestingPinia({ initialState: { auth: { isLoggedIn: false } } })
    wrapper = shallowMount(App, { global: { plugins: [pinia, mockRouter] } })
  })

  it('redirects to login when the user is not logged in', () => {
    mockRouter.push('/').then(() => {
      expect(wrapper.vm.$route.path).toBe('/login')
    })
  })

  it('continues to the next route when the user is logged in', () => {
    const authStore = useAuthStore()
    authStore.$patch({ isLoggedIn: true })

    mockRouter.push('/').then(() => {
      expect(wrapper.vm.$route.path).toBe('/')
    })
  })
})
