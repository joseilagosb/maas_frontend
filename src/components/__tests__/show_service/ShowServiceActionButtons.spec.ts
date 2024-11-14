import type { ComponentPublicInstance } from 'vue'
import { RouterLinkStub, shallowMount, VueWrapper } from '@vue/test-utils'
import { useRoute, type RouterLinkProps } from 'vue-router'
import { describe, expect, it, vi, afterAll, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

import ShowServiceActionButtons from '@/components/show_service/ShowServiceActionButtons.vue'

import { testParams, testState, testTime } from '@/test/data'
import { shallowMountWithPinia } from '@/test/utils'

describe('ShowServiceActionButtons', () => {
  vi.mock('vue-router')
  vi.mocked(useRoute).mockReturnValue({ params: testParams.service } as any)

  afterAll(() => {
    vi.restoreAllMocks()
  })

  let wrapper: VueWrapper<ComponentPublicInstance<typeof ShowServiceActionButtons>>

  const editServiceWeekButtonSelector = '[data-testid="edit-service-week-button"]'

  describe('edit my availability button', async () => {
    let editServiceWeekButton: VueWrapper<ComponentPublicInstance<RouterLinkProps>>

    describe('user is logged in and the selected week is the current or a future week', () => {
      beforeEach(() => {
        wrapper = shallowMount(ShowServiceActionButtons, {
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
        }) as any

        editServiceWeekButton = wrapper.findComponent(editServiceWeekButtonSelector) as any
      })

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

    describe("user isn't logged in", () => {
      beforeEach(() => {
        wrapper = shallowMountWithPinia(ShowServiceActionButtons, {
          initialState: {
            auth: testState.notLoggedInAuthStore,
            service: testState.showServiceStore
          }
        }) as any

        editServiceWeekButton = wrapper.findComponent(editServiceWeekButtonSelector) as any
      })

      it('does not exist', () => {
        expect(editServiceWeekButton.exists()).toBe(false)
      })
    })

    describe('user is logged in and the selected week is the past week', () => {
      beforeEach(() => {
        wrapper = shallowMountWithPinia(ShowServiceActionButtons, {
          initialState: {
            auth: testState.userAuthStore,
            service: { ...testState.showServiceStore, selectedWeek: testTime.week - 1 }
          }
        }) as any

        editServiceWeekButton = wrapper.findComponent(editServiceWeekButtonSelector) as any
      })

      it('does not exist', () => {
        expect(editServiceWeekButton.exists()).toBe(false)
      })
    })
  })
})
