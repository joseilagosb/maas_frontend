import { vi } from 'vitest'

export const mockAxios = {
  // post: vi.fn().mockImplementation((url, data) => {
  //   if (url === 'http://localhost:3000/login') {
  //     if (data.email === 'cristiano@gmail.com' && data.password === 'contrasena') {
  //       return Promise.resolve({
  //         data: {
  //           status: 200,
  //           message: 'Logged in successfully',
  //           user: { id: 1, name: 'Cristiano', email: 'cristiano@gmail.com' }
  //         },
  //         status: 200,
  //         headers: { Authorization: 'Bearer 123456' }
  //       })
  //     } else {
  //       return Promise.resolve({
  //         data: { status: 401, message: 'Invalid credentials' },
  //         status: 401
  //       })
  //     }
  //   }
  // }),
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
