import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import LoginForm from '../LoginForm.vue'

describe('LoginForm', () => {
  const wrapper = shallowMount(LoginForm)

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

  it.todo('shows error message when credentials are incorrect')

  it.todo('redirects to the home page when the credentials are correct')
})
