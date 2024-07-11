import { vi } from 'vitest'
import { testData } from '../data'

export const mockAxios = {
  get: vi.fn().mockImplementation((url) => {
    if (url === 'http://localhost:3000/services') {
      return Promise.resolve({
        data: testData.services,
        status: 200
      })
    }
  }),
  delete: vi.fn().mockImplementation((url) => {
    if (url === 'http://localhost:3000/logout') {
      return Promise.resolve({
        data: { status: 200, message: 'Logged out successfully' },
        status: 200
      })
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
