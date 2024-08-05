import { expect, it, beforeEach, describe } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import App from '@/App.vue'
import { checkIfNotLoggedIn, routes } from '..'
import { testData, testState, testTime } from '@/test/data'

describe('router', async () => {
  let pinia: ReturnType<typeof createTestingPinia>
  let wrapper: ReturnType<typeof shallowMount>
  let router: ReturnType<typeof createRouter>

  describe('when the user is not logged in', () => {
    beforeEach(() => {
      pinia = createTestingPinia({ initialState: { auth: testState.notLoggedInAuthStore } })
      router = createRouter({
        history: createWebHistory(),
        routes: routes
      })
      router.beforeEach(checkIfNotLoggedIn)
      wrapper = shallowMount(App, { global: { plugins: [pinia, router] } })
    })

    it('redirects to /login', async () => {
      router.push('/')
      await router.isReady()
      expect(wrapper.vm.$route.path).toBe('/login')
    })
  })

  describe('when the user is logged in', () => {
    const expectedParams = {
      id: testData.service.id,
      week: testTime.week
    }

    beforeEach(() => {
      pinia = createTestingPinia({ initialState: { auth: testState.userAuthStore } })
      router = createRouter({
        history: createWebHistory(),
        routes: routes
      })
      router.beforeEach(checkIfNotLoggedIn)
      wrapper = shallowMount(App, { global: { plugins: [pinia, router] } })
    })

    describe('navigation to /', () => {
      it('redirects to /services', async () => {
        router.push('/')
        await router.isReady()
        expect(wrapper.vm.$route.path).toBe('/services')
      })
    })

    describe('navigation to /services/:id', () => {
      it('redirects to /services/:id/weeks/:week', async () => {
        router.push(`/services/${testData.service.id}`)
        await router.isReady()

        expect(wrapper.vm.$route.name).toBe('show-service-week')
        expect(+wrapper.vm.$route.params.id).toEqual(expectedParams.id)
        expect(+wrapper.vm.$route.params.week).toEqual(expectedParams.week)
      })
    })

    describe('navigation to /services/:id/weeks', () => {
      it('redirects to /services/:id/weeks/:week', async () => {
        router.push(`/services/${testData.service.id}/weeks`)
        await router.isReady()

        expect(wrapper.vm.$route.name).toBe('show-service-week')
        expect(+wrapper.vm.$route.params.id).toEqual(expectedParams.id)
        expect(+wrapper.vm.$route.params.week).toEqual(expectedParams.week)
      })
    })
  })
})
