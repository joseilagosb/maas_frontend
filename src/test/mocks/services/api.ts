import { testData } from '../../data'
import { NULL_OBJECTS } from '@/utils/constants'

export const mockAPIService = {
  postLogin: () => Promise.resolve(testData.user),
  deleteLogout: () => Promise.resolve(NULL_OBJECTS.USER),
  getServices: () => Promise.resolve(testData.services),
  getService: () =>
    Promise.resolve({
      ...testData.service,
      serviceWorkingDays: [...testData.serviceWorkingDays],
      serviceWeeks: [...testData.serviceWeeks]
    }),
  getServiceWeek: (_: number, __: number, mode: 'show' | 'edit') => {
    switch (mode) {
      case 'edit':
        return Promise.resolve({
          ...testData.serviceWeeks[0],
          serviceDays: testData.serviceDays.map((serviceDay: any) => ({
            ...serviceDay,
            serviceHours: testData.serviceHoursWithUsers
          }))
        })
      case 'show':
      default:
        return Promise.resolve({
          ...testData.serviceWeeks[0],
          serviceDays: [...testData.serviceDays]
        })
    }
  },
  getUserHoursAssignments: () => Promise.resolve(testData.userHoursAssignments)
}
