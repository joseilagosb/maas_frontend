import { vi } from 'vitest'
import { testData, testResponses } from '../data'

export const mockAxios = {
  get: vi.fn().mockImplementation((url) => {
    switch (url) {
      case `http://localhost:3000/services/${testData.services[0].id}`: {
        console.log('hola')
        return Promise.resolve(testResponses.service[200])
      }
      case 'http://localhost:3000/services':
        return Promise.resolve(testResponses.services[200])
      default:
        break
    }
    if (url === 'http://localhost:3000/services') {
      return Promise.resolve(testResponses.services[200])
    }
  }),
  delete: vi.fn().mockImplementation((url) => {
    if (url === 'http://localhost:3000/logout') {
      return Promise.resolve(testResponses.logout[200])
    }
  }),
  create: vi.fn().mockReturnThis(),
  interceptors: {
    request: {
      use: vi.fn(),
      eject: vi.fn()
    },
    response: {
      use: vi.fn(),
      eject: vi.fn()
    }
  }
}
