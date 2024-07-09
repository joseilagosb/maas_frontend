import MainLayout from '@/components/layouts/Main.vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

describe('MainLayout', () => {
  const wrapper = mount(MainLayout)

  const loginButtonSelector = '[data-testid="login-button"]'

  it.todo('shows the username when logged in')
  it('shows a login button when not logged in', () => {
    expect(wrapper.find(loginButtonSelector).text()).toBe('Iniciar sesión')
  })
})
