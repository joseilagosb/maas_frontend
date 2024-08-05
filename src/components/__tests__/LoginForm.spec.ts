import { describe, it, expect, vi, afterAll } from 'vitest'

import LoginForm from '../LoginForm.vue'
import { setUseRouterMock, shallowMountWithPinia } from '@/test/utils'
import { testData, testState } from '@/test/data'

describe('LoginForm', () => {
  vi.mock('vue-router')
  afterAll(() => {
    vi.restoreAllMocks()
  })

  setUseRouterMock('home')
  const wrapper = shallowMountWithPinia(LoginForm, {
    initialState: { auth: testState.notLoggedInAuthStore }
  })
  const errorMessageSelector = '[data-testid="error-message"]'

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
    const errorMessage = wrapper.find(errorMessageSelector)

    await emailInput.setValue(testData.user.email)
    await passwordInput.setValue('no_es_la_contrasena')

    submitButton.trigger('click').catch(() => {
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.find('h4').text()).toEqual('Ha ocurrido un error al iniciar sesión.')
      expect(errorMessage.find('p').text()).toEqual(
        'Comprueba que las credenciales que ingresaste estén correctas.'
      )
    })
  })

  it('shows the flash message if the user is not logged in', () => {
    setUseRouterMock('login', { redirected: 'notloggedin' })
    const newWrapper = shallowMountWithPinia(LoginForm, {
      initialState: { auth: testState.notLoggedInAuthStore }
    })

    expect(newWrapper.find('[data-testid="flash-message"]').exists()).toBe(true)
  })
})
