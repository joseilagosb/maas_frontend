<script setup lang="ts">
import { watch, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useServiceAvailabilityStore } from '@/stores/service_availability'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'

const saveButtonDisabled = ref(true)
const router = useRouter()

const serviceAvailabilityStore = useServiceAvailabilityStore()
const { changedAvailability } = storeToRefs(serviceAvailabilityStore)

import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const $toast = useToast();

watch([changedAvailability], () => {
  saveButtonDisabled.value = false
})

const submitAvailability = () => {
  serviceAvailabilityStore.submitAvailability().then(() => {
    router.back()
  }).catch((error: Error) => {
    $toast.error(error.message)
  })
}
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
    @click="submitAvailability">
    <FontAwesomeIcon :icon="faPaperPlane"
      class="text-xl text-white group-hover:text-black group-disabled:text-gray-600 transition-colors duration-300" />
    <span
      class="text-xl font-condensed-regular text-white group-hover:text-black group-disabled:text-gray-600 transition-colors duration-300 uppercase">Guardar</span>
  </button>
</template>

<style></style>
