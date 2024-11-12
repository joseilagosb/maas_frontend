<script setup lang="ts">
import { watch, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useServiceAvailabilityStore } from '@/stores/service_availability'

import ConfirmChangesModal from './ConfirmChangesModal.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'

const saveButtonDisabled = ref(true)

const serviceAvailabilityStore = useServiceAvailabilityStore()
const { changedAvailability } = storeToRefs(serviceAvailabilityStore)

const confirmChangesModalIsOpen = ref(false)

const openConfirmChangesModal = () => {
  confirmChangesModalIsOpen.value = true
}

const closeConfirmChangesModal = () => {
  confirmChangesModalIsOpen.value = false
}

watch([changedAvailability], () => {
  saveButtonDisabled.value = false
})
</script>

<template>
  <RouterLink :to="{ name: 'show-service-week' }"
    class="group flex items-center gap-3 cursor-pointer px-4 py-3 bg-orange-400 hover:bg-orange-500 transition-colors duration-300"
    data-testid="discard-changes-button">
    <FontAwesomeIcon :icon="faArrowLeft"
      class="text-xl text-white group-hover:text-black transition-colors duration-300" />
    <span
      class="text-xl font-condensed-regular text-white group-hover:text-black transition-colors duration-300 uppercase">Cancelar
      cambios</span>
  </RouterLink>
  <button
    class="group flex items-center gap-3 cursor-pointer px-4 py-3 bg-orange-500 hover:bg-orange-600 transition-colors duration-300 disabled:bg-gray-400"
    :class="{ 'pointer-events-none': saveButtonDisabled }" data-testid="save-button" :disabled="saveButtonDisabled"
    @click="openConfirmChangesModal">
    <FontAwesomeIcon :icon="faPaperPlane"
      class="text-xl text-white group-hover:text-black group-disabled:text-gray-600 transition-colors duration-300" />
    <span
      class="text-xl font-condensed-regular text-white group-hover:text-black group-disabled:text-gray-600 transition-colors duration-300 uppercase">Guardar</span>
  </button>
  <ConfirmChangesModal :is-open="confirmChangesModalIsOpen" @modal-close="closeConfirmChangesModal"
    @close-modal="closeConfirmChangesModal" data-testid="confirm-changes-modal" />
</template>

<style></style>
