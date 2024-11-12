import { mount, shallowMount } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'

import CustomModal from '../CustomModal.vue'

describe('CustomModal', () => {
  const wrapper = shallowMount(CustomModal, {
    props: { isOpen: true }
  })

  it('shows up if isOpen is true', () => {
    expect(wrapper.find('[data-testid="modal"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="modal-backdrop"]').exists()).toBe(true)
  })

  it('hides if isOpen is false', () => {
    const hiddenModalWrapper = shallowMount(CustomModal, {
      props: { isOpen: false }
    })
    expect(hiddenModalWrapper.find('[data-testid="modal"]').exists()).toBe(false)
    expect(hiddenModalWrapper.find('[data-testid="modal-backdrop"]').exists()).toBe(false)
  })

  it('emits modal-close event when clicking outside', async () => {
    // it's tricky to test this because the onclickoutside event is bound to window
    // triggering a click on window will emit the modal-close event
    window.dispatchEvent(new MouseEvent('click'))

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('modal-close')).toBeTruthy()
  })
})
