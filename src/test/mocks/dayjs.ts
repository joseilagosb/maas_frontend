import { vi } from 'vitest'

const CURRENT_WEEK = 10
const CURRENT_YEAR = 2024

export const mockDayjs = {
  default: vi.fn().mockImplementation(() => {
    return {
      week: vi.fn().mockReturnValue(CURRENT_WEEK),
      year: vi.fn().mockReturnValue(CURRENT_YEAR),
      format: vi.fn((str) => {
        if (str === 'DD/MM/YYYY') {
          return `12/${CURRENT_WEEK}/${CURRENT_YEAR}`
        }
      })
    }
  })
}
