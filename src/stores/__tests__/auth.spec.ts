import { createPinia } from 'pinia'
import { describe, expect, it, beforeEach } from 'vitest'
import { useAuthStore } from '../auth'
import { NULL_OBJECTS } from '@/utils/constants'

describe('Auth Store', () => {
  let authStore: ReturnType<typeof useAuthStore>
  beforeEach(() => {
    authStore = useAuthStore(createPinia())
    authStore.$patch({ isLoggedIn: false, user: { ...NULL_OBJECTS.USER } })
  })

  describe('login', () => {
    it('logs in a valid user', async () => {
      const aValidUser = { email: 'messi@maas.com', password: 'contrasena' }

      expect(authStore.isLoggedIn).toBe(false)
      await authStore.login(aValidUser.email, aValidUser.password)
      expect(authStore.isLoggedIn).toBe(true)
    })

    it('throws an error when the user is not valid', async () => {
      const anInvalidUser = { email: 'messi@maas.com', password: 'no_es_la_contrasena' }

      expect(authStore.isLoggedIn).toBe(false)
      await authStore.login(anInvalidUser.email, anInvalidUser.password).catch((error: Error) => {
        expect(error.message).toEqual('Request failed with status code 401')
        expect(authStore.isLoggedIn).toBe(false)
      })
    })
  })

  describe('log out', () => {
    it("doesn't log out when the user is not logged in", async () => {
      authStore.$patch({ isLoggedIn: false, user: NULL_OBJECTS.USER })
      expect(authStore.isLoggedIn).toBe(false)
      await authStore.logout()
      expect(authStore.isLoggedIn).toBe(false)
    })

    it('logs out successfully', async () => {
      const anAlreadyLoggedInUser = { email: 'messi@maas.com', password: 'contrasena' }
      authStore.$patch({ isLoggedIn: true, user: anAlreadyLoggedInUser })

      expect(authStore.isLoggedIn).toBe(true)
      await authStore.logout()
      expect(authStore.isLoggedIn).toBe(false)
      expect(authStore.user).toEqual(NULL_OBJECTS.USER)
    })
  })
})
