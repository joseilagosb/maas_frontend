import { vi } from 'vitest'
import { testData } from '../../data'
import { NULL_OBJECTS } from '@/utils/constants'

export const mockAPIService = {
  postLogin: vi.fn().mockImplementation(() => {
    return Promise.resolve(testData.user)
  }),
  deleteLogout: vi.fn().mockImplementation(() => {
    return Promise.resolve(NULL_OBJECTS.USER)
  }),
  getWeekUsersCount: vi.fn().mockReturnThis(),
  getServices: vi.fn().mockImplementation(() => {
    return Promise.resolve(testData.services)
  }),
  getService: vi.fn().mockImplementation(() => {
    return Promise.resolve({
      ...testData.services[0],
      serviceWorkingDays: [...testData.serviceWorkingDays],
      serviceWeeks: [...testData.serviceWeeks]
    })
  }),
  getServiceWeek: vi.fn().mockImplementation(() => {
    return Promise.resolve(testData.serviceWeeks[0])
  })
}
