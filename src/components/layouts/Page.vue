<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPersonBooth } from '@fortawesome/free-solid-svg-icons'
import { useAuthStore } from '@/stores/auth'
import { faBuilding } from '@fortawesome/free-regular-svg-icons'
import { useSlots } from 'vue'

const authStore = useAuthStore()
const slots = useSlots()
</script>

<template>
  <div
    class="w-full h-[calc(100vh-60px)] flex flex-col gap-4 items-center justify-center pt-4 px-2"
  >
    <nav class="flex justify-between items-left gap-4 w-full">
      <div class="flex flex-row items-center gap-4">
        <RouterLink
          to="/services"
          class="flex items-center gap-4 cursor-pointer px-4 py-2 bg-orange-500 rounded-lg text-white"
        >
          <FontAwesomeIcon :icon="faPersonBooth" class="text-md" />
          <span class="text-md font-medium">Servicios</span>
        </RouterLink>
        <RouterLink
          to="/companies"
          v-if="authStore.isAdmin"
          class="flex items-center gap-4 cursor-pointer px-4 py-2 bg-orange-500 rounded-lg text-white"
          data-testid="companies-button"
        >
          <FontAwesomeIcon :icon="faBuilding" class="text-md" />
          <span class="text-md font-medium">Empresas</span>
        </RouterLink>
      </div>
      <slot name="action-buttons"></slot>
    </nav>
    <div class="flex flex-row size-full overflow-hidden">
      <div
        :class="slots.sidebar ? 'w-[75%]' : 'w-full'"
        class="overflow-y-auto overflow-x-hidden tiny-scrollbar"
        data-testid="content"
      >
        <slot name="content"></slot>
      </div>
      <div
        v-if="slots.sidebar"
        class="w-[25%] overflow-y-auto tiny-scrollbar"
        data-testid="sidebar"
      >
        <slot name="sidebar"></slot>
      </div>
    </div>
  </div>
</template>

<style></style>
