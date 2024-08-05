import { createPinia } from 'pinia'
import { describe, expect, it, beforeEach } from 'vitest'
import { useAuthStore } from '../auth'

import { testData, testState } from '@/test/data'

import { NULL_OBJECTS } from '@/utils/constants'

describe('Auth Store', () => {
  let authStore: ReturnType<typeof useAuthStore>
  beforeEach(() => {
    authStore = useAuthStore(createPinia())
    authStore.$patch({ ...testState.notLoggedInAuthStore })
  })

  describe('login', () => {
    it('logs in a valid user', async () => {
      const aValidUser = { ...testData.loginInput }

      expect(authStore.isLoggedIn).toBe(false)
      await authStore.login(aValidUser.email, aValidUser.password)
      expect(authStore.isLoggedIn).toBe(true)
    })

    it('throws an error when the user is not valid', async () => {
      const anInvalidUser = { ...testData.loginInput, password: 'no_es_la_contrasena' }

      expect(authStore.isLoggedIn).toBe(false)
      await authStore.login(anInvalidUser.email, anInvalidUser.password).catch((error: Error) => {
        expect(error.message).toEqual('Request failed with status code 401')
        expect(authStore.isLoggedIn).toBe(false)
      })
    })
  })

  describe('logout', () => {
    it("doesn't log out when the user is not logged in", async () => {
      authStore.$patch({ ...testState.notLoggedInAuthStore })
      expect(authStore.isLoggedIn).toBe(false)
      await authStore.logout()
      expect(authStore.isLoggedIn).toBe(false)
    })

    it('logs out successfully', async () => {
      authStore.$patch({ ...testState.userAuthStore })

      expect(authStore.isLoggedIn).toBe(true)
      await authStore.logout()
      expect(authStore.isLoggedIn).toBe(false)
      expect(authStore.user).toEqual(NULL_OBJECTS.USER)
    })
  })

  describe('isAdmin', () => {
    it('returns false when the user is not an admin', () => {
      authStore.$patch({ ...testState.userAuthStore })
      expect(authStore.isAdmin).toBe(false)
    })

    it('returns true when the user is an admin', () => {
      authStore.$patch({ ...testState.adminAuthStore })
      expect(authStore.isAdmin).toBe(true)
    })
  })

  describe('isUser', () => {
    it('returns true when the user is a user', () => {
      authStore.$patch({ ...testState.userAuthStore })
      expect(authStore.isUser).toBe(true)
    })

    it('returns false when the user is not a user', () => {
      authStore.$patch({ ...testState.adminAuthStore })
      expect(authStore.isUser).toBe(false)
    })
  })
})
