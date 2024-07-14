<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import MainLayout from '@/components/layouts/Main.vue'
import ServiceOverview from '@/components/ServiceOverview.vue'

import { useAuthStore } from '@/stores/auth'
import { useServiceAvailabilityStore } from '@/stores/service_availability'

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'

import EditAvailabilityGrid from '@/components/EditAvailabilityGrid.vue'

const route = useRoute()
const authStore = useAuthStore()

const saveButtonDisabled = ref(true)

const serviceAvailabilityStore = useServiceAvailabilityStore()
const { changedAvailability } = storeToRefs(serviceAvailabilityStore)

watch([changedAvailability], () => {
  saveButtonDisabled.value = false
})
</script>

<template>
  <MainLayout>
    <ServiceOverview>
      <template #action-buttons>
        <RouterLink
          :to="`/services/${route.params.id}`"
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
      <template #grid>
        <EditAvailabilityGrid />
      </template>
    </ServiceOverview>
  </MainLayout>
</template>
