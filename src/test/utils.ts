import { vi } from 'vitest'
import type { ComponentPublicInstance } from 'vue'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia, type TestingOptions } from '@pinia/testing'

import { addToDate, formatDateInSpanish } from '@/services/date'
import { testTime } from './data'
import { useRouter } from 'vue-router'
import { mockUseRouter } from './mocks/use_router'

// Prepara la función formatDateInSpanish para retornar durante las próximas siete ejecuciones un valor
// de fecha de prueba
export const prepareFormatDateMethods = () => {
  const mockFormatDateInSpanish = vi.mocked(formatDateInSpanish)
  const mockAddToDate = vi.mocked(addToDate)

  mockAddToDate.mockClear()
  mockFormatDateInSpanish.mockClear()

  for (let dateInSpanish of testTime.date.inSpanish) {
    mockFormatDateInSpanish.mockReturnValueOnce(dateInSpanish)
  }
}

export const shallowMountWithPinia = (
  component: any,
  piniaOptions: TestingOptions
): VueWrapper<ComponentPublicInstance<typeof component>> => {
  return shallowMount(component, {
    global: { plugins: [createTestingPinia(piniaOptions)] }
  })
}

export const setUseRouterMock = (routeName: string, query?: Record<string, string>) => {
  vi.mocked(useRouter).mockReturnValue(mockUseRouter(routeName, query))
}
