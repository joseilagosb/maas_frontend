import type { ComponentPublicInstance } from 'vue'
import { RouterLinkStub, shallowMount, VueWrapper } from '@vue/test-utils'
import { useRoute, type RouterLinkProps } from 'vue-router'
import { describe, expect, it, vi, afterAll } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

import ShowServiceActionButtons from '@/components/show_service/ShowServiceActionButtons.vue'

import { testData, testState, testTime } from '@/test/data'

describe('ShowServiceActionButtons', () => {
  vi.mock('vue-router')

  const service = testData.services[0]
  const editServiceWeekButtonSelector = '[data-testid="edit-service-week-button"]'

  afterAll(() => {
    vi.restoreAllMocks()
  })

  describe('edit my availability button', () => {
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

    it('exists', () => {
      expect(wrapper.find(editServiceWeekButtonSelector).exists()).toBe(true)
    })

    it('renders with the correct title', () => {
      const editServiceWeekButtonTitle = wrapper.find(editServiceWeekButtonSelector).find('span')

      expect(editServiceWeekButtonTitle.text()).toEqual('Editar mi disponibilidad')
    })

    it('links to the correct route', () => {
      const editServiceWeekButton = wrapper.findComponent(
        editServiceWeekButtonSelector
      ) as VueWrapper<ComponentPublicInstance<RouterLinkProps>>

      const expectedRoute = {
        name: 'edit-service-week',
        params: { id: service.id, week: testTime.week }
      }

      expect(editServiceWeekButton.props('to')).toEqual(expectedRoute)
    })
  })
})
