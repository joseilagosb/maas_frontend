import { describe, expect, it, vi, beforeEach } from 'vitest'
import { RouterLinkStub, shallowMount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useRoute } from 'vue-router'

import ShowServiceActionButtons from '@/components/show_service/ShowServiceActionButtons.vue'

import { testData, testState, testTime } from '@/test/data'

describe('ShowServiceActionButtons', () => {
  vi.mock('vue-router')

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  const service = testData.services[0]
  const editServiceWeekButtonSelector = '[data-testid="edit-service-week-button"]'

  describe('if its a user', () => {
    it('renders the edit my availability button if its a user', () => {
      vi.mocked(useRoute).mockReturnValue({
        params: { id: service.id, week: testTime.week }
      } as any)

      const wrapper = shallowMount(ShowServiceActionButtons, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: { ...testState.user, selectedWeek: testTime.week }
            })
          ],
          stubs: {
            RouterLink: RouterLinkStub
          }
        }
      })

      expect(wrapper.find(editServiceWeekButtonSelector).exists()).toBe(true)
      const editServiceWeekButtonTitle = wrapper.find(editServiceWeekButtonSelector).find('span')

      expect(editServiceWeekButtonTitle.text()).toEqual('Editar mi disponibilidad')
    })
  })
})
