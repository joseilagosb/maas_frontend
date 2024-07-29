import { shallowMount } from '@vue/test-utils'

import { createTestingPinia, type TestingOptions } from '@pinia/testing'

export const shallowMountWithPinia = (component: any, piniaOptions: TestingOptions) => {
  return shallowMount(component, {
    global: { plugins: [createTestingPinia(piniaOptions)] }
  })
}
