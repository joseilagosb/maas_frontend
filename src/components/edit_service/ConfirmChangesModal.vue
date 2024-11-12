<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification';

import CustomModal from '@/components/CustomModal.vue'

import { useServiceAvailabilityStore } from '@/stores/service_availability';

const router = useRouter()
const $toast = useToast();

const wasSubmitted = ref(false)

const serviceAvailabilityStore = useServiceAvailabilityStore()

import 'vue-toast-notification/dist/theme-sugar.css';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['modal-close'])

const getLoadingIconUrl = new URL('../../assets/images/loading.gif', import.meta.url).href

const submitAvailability = () => {
  wasSubmitted.value = true

  serviceAvailabilityStore.submitAvailability().then(() => {
    router.back()
  }).catch((error: Error) => {
    $toast.error(error.message)
  })
}

</script>

<template>
  <CustomModal :is-open="props.isOpen" @modal-close="emit('modal-close')" data-testid="confirm-changes-modal">
    <template #header>
      <h2 v-if="!wasSubmitted" class="text-2xl font-condensed-bold text-orange-500">¿Estás seguro de que quieres guardar
        tus cambios?</h2>
    </template>
    <template #body>
      <p v-if="!wasSubmitted" class="text-lg font-condensed-regular text-gray-500">
        Se generará un nuevo cronograma de turnos asignados para la semana seleccionada.
      </p>
      <div v-else class="flex flex-col items-center gap-2 pt-2">
        <img :src="getLoadingIconUrl" alt="loading gif" class="w-24 h-24" />
        <p class="text-xl font-condensed-regular text-gray-500">
          Guardando cambios...
        </p>
      </div>
    </template>
    <template #footer>
      <div v-if="!wasSubmitted" class="flex flex-col items-center gap-2 pt-2">
        <button @click.stop="emit('modal-close')"
          class="bg-orange-500 hover:bg-orange-600 transition-colors duration-300 p-4" data-testid="cancel-button">
          <span class="text-white font-condensed-regular uppercase">Quiero seguir editando</span>
        </button>
        <button @click.stop="submitAvailability"
          class="bg-orange-500 hover:bg-orange-600 transition-colors duration-300 p-4"
          data-testid="submit-availability-button">
          <span class="text-white font-condensed-regular uppercase">Confirmar cambios</span>
        </button>
      </div>
    </template>
  </CustomModal>
</template>

<style scoped></style>
