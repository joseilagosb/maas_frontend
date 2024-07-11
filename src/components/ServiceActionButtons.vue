<script setup lang="ts">
import { RouterLink } from 'vue-router';

import { useAuthStore } from '@/stores/auth';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const authStore = useAuthStore();
</script>

<template>
  <div v-if="authStore.isAdmin" class="flex flex-row items-center gap-4">
    <RouterLink to="/services/new"
      class="flex items-center gap-4 cursor-pointer px-4 py-2 bg-orange-500 rounded-lg text-white"
      data-testid="new-service-button">
      <FontAwesomeIcon :icon="faPlus" class="text-md" />
      <span class="text-md font-medium">Nuevo servicio</span>
    </RouterLink>
  </div>
</template>