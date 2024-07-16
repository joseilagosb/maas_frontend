<script setup lang="ts">
import { watch, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth'
import { useServiceAvailabilityStore } from '@/stores/service_availability'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'

const authStore = useAuthStore()

const route = useRoute()

const saveButtonDisabled = ref(true)

const serviceAvailabilityStore = useServiceAvailabilityStore()
const { changedAvailability } = storeToRefs(serviceAvailabilityStore)

watch([changedAvailability], () => {
  saveButtonDisabled.value = false
})
</script>

<template>
  <RouterLink
    :to="{ name: 'show-service-week', params: { id: route.params.id } }"
    v-if="authStore.isUser"
    class="flex items-center gap-4 cursor-pointer px-4 py-2 bg-orange-400 rounded-lg text-white"
    data-testid="back-to-service-button"
  >
    <FontAwesomeIcon :icon="faArrowLeft" class="text-md" />
    <span class="text-md font-medium">Cancelar cambios</span>
  </RouterLink>
  <button
    v-if="authStore.isUser"
    class="flex items-center gap-4 px-4 py-2 bg-orange-500 disabled:bg-gray-400 rounded-lg text-white"
    data-testid="back-to-service-button"
    :disabled="saveButtonDisabled"
  >
    <FontAwesomeIcon :icon="faPaperPlane" class="text-md" />
    <span class="text-md font-medium">Guardar</span>
  </button>
</template>

<style></style>
