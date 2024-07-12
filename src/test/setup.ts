import { afterAll, beforeAll, vi } from 'vitest'
import localStorageMock from './mocks/local_storage'
import { mockAxios } from './mocks/axios'
import { beforeEach } from 'node:test'

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
