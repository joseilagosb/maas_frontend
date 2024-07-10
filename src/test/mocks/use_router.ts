import { vi } from 'vitest'

import type { Router } from 'vue-router'

export const mockUseRouter = (routeName: any, query?: Record<string, string>): Router => {
  return {
    currentRoute: {
      value: { name: routeName, query: { ...(query || {}) } }
    },
    push: vi.fn(),
    replace: vi.fn()
  } as any
}
