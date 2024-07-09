import { createPinia, setActivePinia } from 'pinia'
import { beforeAll, describe, expect, it } from 'vitest'
import { useAuthStore } from '../auth'

describe('Auth Store', () => {
  beforeAll(() => {
    setActivePinia(createPinia())
  })

  it('logs in a valid user', async () => {
    const authStore = useAuthStore()
    const aValidUser = { email: 'messi@maas.com', password: 'contrasena' }

    expect(authStore.isLoggedIn).toBe(false)
    await authStore.login(aValidUser.email, aValidUser.password)
    expect(authStore.isLoggedIn).toBe(true)
  })

  it.todo('throws an error when the user is not valid')

  it.todo('logs out')
})
