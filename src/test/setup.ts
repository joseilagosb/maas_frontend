import { afterAll, beforeAll, vi } from 'vitest'

import { mockLocalStorage } from './mocks/local_storage'
import { mockJSONAPISerializer } from './mocks/jsonapi_serializer'
import { mockDateService } from './mocks/services/date'
import { mockAPIService } from './mocks/services/api'

let originalLocalStorage: Storage

console.log('[test/setup] Configuración de pruebas iniciada.')

vi.mock('jsonapi-serializer', () => mockJSONAPISerializer)
vi.mock('@/services/date', () => mockDateService)
vi.mock('@/services/api', async (importOriginal) => {
  const originalModule = await importOriginal<typeof import('@/services/api')>()
  return {
    ...originalModule,
    ...mockAPIService
  }
})

// Se configura localStorage para que se ocupe en su lugar el mock localStorageMock
beforeAll((): void => {
  originalLocalStorage = window.localStorage
  ;(window as any).localStorage = mockLocalStorage
})
afterAll((): void => {
  ;(window as any).localStorage = originalLocalStorage
  vi.restoreAllMocks()
})

console.log('[test/setup] Configuración de pruebas finalizada.')
