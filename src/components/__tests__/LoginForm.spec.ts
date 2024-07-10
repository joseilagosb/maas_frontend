import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import LoginForm from '../LoginForm.vue'
import { createTestingPinia } from '@pinia/testing'

describe('LoginForm', () => {
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

  it.todo('shows error message when credentials are incorrect', async () => {
    await emailInput.setValue(validUser.email)
    await passwordInput.setValue('no_es_la_contrasena')

    await submitButton.trigger('click')

    const errorMessage = wrapper.find('[data-testid="error-message"]')

    expect(errorMessage.exists()).toBe(true)
    expect(errorMessage.find('h4').text()).toEqual('Ha ocurrido un error al iniciar sesión.')
    expect(errorMessage.find('p').text()).toEqual(
      'Comprueba que las credenciales que ingresaste estén correctas.'
    )
  })
})
