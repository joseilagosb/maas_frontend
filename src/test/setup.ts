import { afterAll, beforeAll, vi } from 'vitest'

import { mockLocalStorage } from './mocks/local_storage'
import { mockJSONAPISerializer } from './mocks/jsonapi_serializer'
import { mockDateService } from './mocks/services/date'
import { mockAPIService } from './mocks/services/api'

let originalLocalStorage: Storage

console.log('[test/setup] Configuración de pruebas iniciada.')

vi.mock('jsonapi-serializer', () => mockJSONAPISerializer)

// TODO: Refactorizar esto
vi.mock('@/services/date', async (importOriginal) => {
  const originalModule = await importOriginal<typeof import('@/services/date')>()
  return {
    ...originalModule,
    getFormattedHour: vi.fn().mockImplementation(mockDateService.getFormattedHour),
    getWeek: vi.fn().mockImplementation(mockDateService.getWeek),
    getYear: vi.fn().mockImplementation(mockDateService.getYear),
    applyDatePlugins: vi.fn().mockImplementation(mockDateService.applyDatePlugins),
    addToDate: vi.fn().mockImplementation(mockDateService.addToDate),
    substractToDate: vi.fn().mockImplementation(mockDateService.substractToDate),
    formatDateInSpanish: vi.fn().mockImplementation(mockDateService.formatDateInSpanish),
    firstDayOfWeek: vi.fn().mockImplementation(mockDateService.firstDayOfWeek),
    lastDayOfWeek: vi.fn().mockImplementation(mockDateService.lastDayOfWeek),
    nthDayOfWeek: vi.fn().mockImplementation(mockDateService.nthDayOfWeek),
    formatDate: vi.fn().mockImplementation(mockDateService.formatDate)
  }
})
vi.mock('@/services/api', async (importOriginal) => {
  const originalModule = await importOriginal<typeof import('@/services/api')>()
  return {
    ...originalModule,
    postLogin: vi.fn().mockImplementation(mockAPIService.postLogin),
    deleteLogout: vi.fn().mockImplementation(mockAPIService.deleteLogout),
    getWeekUsersCount: vi.fn().mockReturnThis(),
    getServices: vi.fn().mockImplementation(mockAPIService.getServices),
    getService: vi.fn().mockImplementation(mockAPIService.getService),
    getServiceWeek: vi.fn().mockImplementation(mockAPIService.getServiceWeek)
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
