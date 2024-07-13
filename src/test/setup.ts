import { afterAll, beforeAll, vi } from 'vitest'
import localStorageMock from './mocks/local_storage'
import { mockAxios } from './mocks/axios'
import { testData } from './data'
import { mockJSONAPISerializer } from './mocks/jsonapi_serializer'
import { mockDayjs } from './mocks/dayjs'
import { formatDate } from '@/utils/dayjs'

let originalLocalStorage: Storage

console.log('[test/setup] Configuración de pruebas iniciada.')

// Se crean mocks para el método 'DELETE' de axios
vi.mock('axios', async () => {
  const axios = await vi.importActual('axios')
  return {
    ...axios,
    default: {
      ...(axios.default as object),
      ...mockAxios
    }
  }
})

vi.mock('jsonapi-serializer', () => mockJSONAPISerializer)

vi.mock('dayjs', () => mockDayjs)
vi.mock('@/utils/dayjs', () => ({
  applyWeekOfYearPlugin: (dayjs: any) => dayjs,
  applySpanishLocale: (dayjs: any) => dayjs,
  firstDayOfWeek: () => 12,
  lastDayOfWeek: () => 18,
  formatDate: (date: any, format: string) => '12/07/2024'
}))

// Se configura localStorage para que se ocupe en su lugar el mock localStorageMock
beforeAll((): void => {
  originalLocalStorage = window.localStorage
  ;(window as any).localStorage = localStorageMock
})
afterAll((): void => {
  ;(window as any).localStorage = originalLocalStorage
  vi.restoreAllMocks()
})

console.log('[test/setup] Configuración de pruebas finalizada.')
