import { createTestingPinia, type TestingOptions } from '@pinia/testing'
import { shallowMount } from '@vue/test-utils'

export const shallowMountWithPinia = (component: any, options: TestingOptions) => {
  return shallowMount(component, {
    global: { plugins: [createTestingPinia(options)] }
  })
}
