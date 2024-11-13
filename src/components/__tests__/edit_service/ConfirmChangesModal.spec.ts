import type { ComponentPublicInstance } from 'vue'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

import ConfirmChangesModal from '@/components/edit_service/ConfirmChangesModal.vue'

import { testParams, testState } from '@/test/data'
import { useServiceAvailabilityStore } from '@/stores/service_availability'
import { putAvailability } from '@/services/api'
import { mockAPIService } from '@/test/mocks/services/api'

describe('ConfirmChangesModal', () => {
  let serviceAvailabilityStore: ReturnType<typeof useServiceAvailabilityStore>
  vi.mock('vue-router')
  vi.mock('vue-toast-notification')

  vi.mocked(useRoute).mockReturnValue({ params: testParams.service } as any)
  vi.mocked(useRouter).mockReturnValue({ back: vi.fn() } as any)
  vi.mocked(useToast).mockReturnValue({ error: vi.fn() } as any)

  afterAll(() => {
    vi.restoreAllMocks()
  })

  describe('actions', () => {
    let wrapper: VueWrapper<ComponentPublicInstance<typeof ConfirmChangesModal>>
    beforeEach(async () => {
      wrapper = mount(ConfirmChangesModal, {
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                user: testState.userAuthStore,
                service: testState.editServiceStore
              },
              stubActions: false
            })
          ]
        },
        props: { isOpen: true }
      }) as any
      serviceAvailabilityStore = useServiceAvailabilityStore()
    })

    describe('submit availability', () => {
      beforeEach(async () => {
        wrapper.find("[data-testid='submit-availability-button']").trigger('click')
        await wrapper.vm.$nextTick()
      })

      it('calls the submitAvailability action', () => {
        expect(serviceAvailabilityStore.submitAvailability).toHaveBeenCalled()
      })

      describe('success', () => {
        it('goes back to the previous route', () => {
          expect(useRouter().back).toHaveBeenCalled()
        })
      })

      describe('failed', () => {
        afterAll(() => {
          vi.mocked(putAvailability).mockImplementation(mockAPIService.putAvailability)
        })

        beforeAll(async () => {
          vi.mocked(putAvailability).mockImplementationOnce(async () => {
            return Promise.reject(new Error('error'))
          })

          wrapper = mount(ConfirmChangesModal, {
            global: {
              plugins: [
                createTestingPinia({
                  initialState: {
                    user: testState.userAuthStore,
                    service: testState.editServiceStore
                  },
                  stubActions: false
                })
              ]
            },
            props: { isOpen: true }
          }) as any

          wrapper.find("[data-testid='submit-availability-button']").trigger('click')
          await wrapper.vm.$nextTick()
        })

        it('shows the toast error message', () => {
          expect(useToast().error).toHaveBeenCalled()
        })
      })
    })
  })

  describe('render', () => {
    describe('is not submitted yet', () => {
      let wrapper: VueWrapper<ComponentPublicInstance<typeof ConfirmChangesModal>>

      beforeEach(async () => {
        wrapper = mount(ConfirmChangesModal, {
          global: {
            plugins: [
              createTestingPinia({
                initialState: {
                  user: testState.userAuthStore,
                  service: testState.editServiceStore
                },
                stubActions: false
              })
            ]
          },
          props: { isOpen: true }
        }) as any
      })

      it('renders the header', () => {
        expect(wrapper.find('[data-testid="modal-header"]').text()).not.toBe('')
        expect(wrapper.find('[data-testid="modal-header"]').text()).toEqual(
          '¿Estás seguro de que quieres guardar tus cambios?'
        )
      })

      it('renders the body', () => {
        expect(wrapper.find('[data-testid="modal-body"]').text()).not.toBe('')
        expect(wrapper.find('[data-testid="modal-body"]').text()).toEqual(
          'Se generará un nuevo cronograma de turnos asignados para la semana seleccionada.'
        )
      })

      it('renders the footer', () => {
        expect(wrapper.find('[data-testid="modal-footer"]').text()).not.toBe('')
        expect(wrapper.findAll('[data-testid="modal-footer"] button')).toHaveLength(2)
      })

      it('closes the modal when clicked on the cancel button', async () => {
        const cancelButton = wrapper.find('[data-testid="cancel-button"]')

        cancelButton.trigger('click')

        wrapper.vm.$nextTick()

        expect(wrapper.emitted('modal-close')).toBeTruthy()
      })

      it('closes the modal when clicked outside', async () => {
        window.dispatchEvent(new MouseEvent('click'))

        wrapper.vm.$nextTick()

        expect(wrapper.emitted('modal-close')).toBeTruthy()
      })
    })

    describe('is submitted', () => {
      let wrapper: VueWrapper<ComponentPublicInstance<typeof ConfirmChangesModal>>

      beforeEach(async () => {
        wrapper = mount(ConfirmChangesModal, {
          global: {
            plugins: [
              createTestingPinia({
                initialState: {
                  user: testState.userAuthStore,
                  service: testState.editServiceStore
                },
                stubActions: false
              })
            ]
          },
          props: { isOpen: true }
        }) as any

        wrapper.find("[data-testid='submit-availability-button']").trigger('click')
        await wrapper.vm.$nextTick()
      })

      it('renders empty header', () => {
        expect(wrapper.find('[data-testid="modal-header"]').text()).toEqual('')
      })

      it('renders the body', () => {
        const modalBody = wrapper.find('[data-testid="modal-body"]')

        expect(modalBody.text()).not.toEqual('')
        expect(modalBody.find('img')).toBeDefined()
        expect(modalBody.find('p')).toBeDefined()
        expect(modalBody.find('p').text()).toEqual('Guardando cambios...')
      })

      it('renders empty footer', () => {
        expect(wrapper.find('[data-testid="modal-footer"]').text()).toEqual('')
      })
    })
  })
})
