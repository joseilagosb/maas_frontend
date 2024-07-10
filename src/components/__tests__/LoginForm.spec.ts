import { describe, it, expect, vi, afterAll, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useRouter } from 'vue-router'

import LoginForm from '../LoginForm.vue'
import { mockUseRouter } from '@/test/mocks/use_router'

const setUseRouter = (routeName: string, query?: Record<string, string>) => {
  vi.mocked(useRouter).mockReturnValue(mockUseRouter(routeName, query))
}

describe('LoginForm', () => {
  afterEach(() => {
    setUseRouter('login')
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  vi.mock('vue-router')
  setUseRouter('home')

  const validUser = { id: 1, email: 'cristiano@gmail.com', password: 'contrasena' }
  const wrapper = shallowMount(LoginForm, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: { auth: { isLoggedIn: false, user: { id: 0, name: '', email: '' } } },
          createSpy: vi.fn
        })
      ]
    }
  })

  const emailInput = wrapper.find('input[type=email]')
  const passwordInput = wrapper.find('input[type=password]')
  const submitButton = wrapper.find('button[type=submit]')

  it('disables the submit button when no email is entered', async () => {
    await emailInput.setValue('')
    await passwordInput.setValue('contrasena')
    expect(submitButton.attributes().disabled).toBeDefined()
  })

  it('disables the submit button when no password is entered', async () => {
    await emailInput.setValue('pepe@gmail.com')
    await passwordInput.setValue('')
    expect(submitButton.attributes().disabled).toBeDefined()
  })

  it('shows error message when credentials are incorrect', async () => {
    const errorMessage = wrapper.find('[data-testid="error-message"]')

    await emailInput.setValue(validUser.email)
    await passwordInput.setValue('no_es_la_contrasena')

    submitButton.trigger('click').catch(() => {
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.find('h4').text()).toEqual('Ha ocurrido un error al iniciar sesión.')
      expect(errorMessage.find('p').text()).toEqual(
        'Comprueba que las credenciales que ingresaste estén correctas.'
      )
    })
  })

  it('shows the flash message if the user is not logged in', async () => {
    setUseRouter('login', { redirected: 'notloggedin' })

    const newWrapper = shallowMount(LoginForm, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: { auth: { isLoggedIn: false, user: { id: 0, name: '', email: '' } } },
            createSpy: vi.fn
          })
        ]
      }
    })

    expect(newWrapper.find('[data-testid="flash-message"]').exists()).toBe(true)
  })
})
