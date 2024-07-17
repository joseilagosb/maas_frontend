import { vi } from 'vitest'
import { testData } from '../data'

export const mockJSONAPISerializer = {
  Deserializer: vi.fn().mockImplementation(() => {
    return {
      deserialize: vi.fn().mockImplementation((data) => {
        if (data.type === 'service') {
          return {
            ...testData.services[0],
            serviceWorkingDays: [...testData.serviceWorkingDays],
            serviceWeeks: [...testData.serviceWeeks]
          }
        }
      })
    }
  })
}