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
    class="flex items-center gap-4 cursor-pointer px-4 py-2 bg-orange-400 rounded-lg text-white"
    data-testid="discard-changes-button">
    <FontAwesomeIcon :icon="faArrowLeft" class="text-md" />
    <span class="text-md font-medium">Cancelar cambios</span>
  </RouterLink>
  <button class="flex items-center gap-4 px-4 py-2 bg-orange-500 disabled:bg-gray-400 rounded-lg text-white"
    data-testid="save-button" :disabled="saveButtonDisabled" @click="submitAvailability">
    <FontAwesomeIcon :icon="faPaperPlane" class="text-md" />
    <span class="text-md font-medium">Guardar</span>
  </button>
</template>

<style></style>
