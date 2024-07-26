import { testData, testResponses } from '../../data'
import { NULL_OBJECTS } from '@/utils/constants'

export const mockAPIService = {
  postLogin: () => Promise.resolve(testData.user),
  deleteLogout: () => Promise.resolve(NULL_OBJECTS.USER),
  getServices: () => Promise.resolve(testData.services),
  getService: () => Promise.resolve(testResponses.service),
  getServiceWeek: (_: number, __: number, mode: 'show' | 'edit') => {
    switch (mode) {
      case 'show':
        return Promise.resolve(testResponses.showServiceWeek)
      case 'edit':
        return Promise.resolve(testResponses.editServiceWeek)
      default:
        return Promise.resolve(testResponses.showServiceWeek)
    }
  }
}
