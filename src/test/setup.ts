import { afterAll, beforeAll } from 'vitest'
import localStorageMock from './mocks/local_storage'

let originalLocalStorage: Storage

console.log('[test/setup] Configuración de pruebas iniciada.')

beforeAll((): void => {
  originalLocalStorage = window.localStorage
  ;(window as any).localStorage = localStorageMock
})

afterAll((): void => {
  ;(window as any).localStorage = originalLocalStorage
})

console.log('[test/setup] Configuración de pruebas finalizada.')
