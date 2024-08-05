import type { ComponentPublicInstance } from 'vue'
import { RouterLinkStub, shallowMount, VueWrapper } from '@vue/test-utils'
import { useRoute, type RouterLinkProps } from 'vue-router'
import { describe, expect, it, vi, afterAll } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

import ShowServiceActionButtons from '@/components/show_service/ShowServiceActionButtons.vue'

import { testParams, testState } from '@/test/data'

describe('ShowServiceActionButtons', () => {
  vi.mock('vue-router')
  vi.mocked(useRoute).mockReturnValue({ params: testParams.service } as any)

  afterAll(() => {
    vi.restoreAllMocks()
  })

  const wrapper = shallowMount(ShowServiceActionButtons, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: { auth: testState.userAuthStore, service: testState.showServiceStore }
        })
      ],
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  const editServiceWeekButtonSelector = '[data-testid="edit-service-week-button"]'

  describe('edit my availability button', async () => {
    const editServiceWeekButton = wrapper.findComponent(
      editServiceWeekButtonSelector
    ) as VueWrapper<ComponentPublicInstance<RouterLinkProps>>

    it('exists', () => {
      expect(editServiceWeekButton.exists()).toBe(true)
    })

    it('renders with the correct title', () => {
      const editServiceWeekButtonTitle = editServiceWeekButton.find('span')

      expect(editServiceWeekButtonTitle.text()).toEqual('Editar mi disponibilidad')
    })

    it('links to the correct route', () => {
      const expectedRoute = { name: 'edit-service-week', params: testParams.service }

      expect(editServiceWeekButton.props('to')).toEqual(expectedRoute)
    })
  })
})
