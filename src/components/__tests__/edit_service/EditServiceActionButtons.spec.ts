import type { ComponentPublicInstance } from 'vue'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { RouterLinkStub, shallowMount, VueWrapper } from '@vue/test-utils'
import { useRoute, type RouterLinkProps } from 'vue-router'
import { createTestingPinia } from '@pinia/testing'

import EditServiceActionButtons from '@/components/edit_service/EditServiceActionButtons.vue'

import { useServiceAvailabilityStore } from '@/stores/service_availability'

import { testState, testTime } from '@/test/data'

describe('EditServiceActionButtons', () => {
  vi.mock('vue-router')
  vi.mocked(useRoute).mockReturnValue({ params: { id: testTime.week } } as any)

  afterAll(() => {
    vi.restoreAllMocks()
  })

  const discardChangesButtonSelector = '[data-testid="discard-changes-button"]'
  const saveButtonSelector = '[data-testid="save-button"]'

  const wrapper = shallowMount(EditServiceActionButtons, {
    global: {
      plugins: [
        createTestingPinia({ initialState: { ...testState.user, selectedWeek: testTime.week } })
      ],
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  })

  describe('discard changes button', () => {
    const discardChangesButton = wrapper.findComponent(discardChangesButtonSelector) as VueWrapper<
      ComponentPublicInstance<RouterLinkProps>
    >

    it('exists', () => {
      expect(discardChangesButton.exists()).toBe(true)
    })

    it('links to the correct route', () => {
      const expectedRoute = {
        name: 'show-service-week',
        params: { id: testTime.week }
      }

      expect(discardChangesButton.props('to')).toEqual(expectedRoute)
    })
  })

  describe('save button', () => {
    const saveButton = wrapper.find(saveButtonSelector)

    it('exists', () => {
      expect(saveButton.exists()).toBe(true)
    })

    it('is disabled on mounted', () => {
      expect(saveButton.attributes().disabled).toBeDefined()
    })

    it('is enabled when the availability changes', async () => {
      const serviceAvailabilityStore = useServiceAvailabilityStore()
      serviceAvailabilityStore.$patch({ changedAvailability: true })

      await wrapper.vm.$nextTick()

      expect(saveButton.attributes().disabled).toBeUndefined()
    })
  })
})
