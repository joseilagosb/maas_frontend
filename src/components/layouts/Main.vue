<script setup lang="ts">
import { useRouter } from 'vue-router'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faWatchmanMonitoring } from '@fortawesome/free-brands-svg-icons';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';

const router = useRouter()

const matchesWithCurrentRoute = (routeName: string) => {
  return router.currentRoute.value.name === routeName;
}
</script>

<template>
  <header class="flex justify-between items-center py-4 px-8 bg-orange-100 h-[60px]">
    <div class="w-[600px] flex flex-row justify-start"></div>
    <RouterLink to="/">
      <div class="flex items-center gap-4 bg-orange-200 h-[200px] w-[350px] translate-y-[-30px] rounded-full">
        <div class="absolute bottom-0 top-[50%] left-0 right-0 flex items-center justify-center gap-4">
          <FontAwesomeIcon :icon="faWatchmanMonitoring" class="text-orange-500 text-6xl" />
          <div class="flex flex-col w-[40%]">
            <h2 class="text-2xl font-bold">MaaS</h2>
            <p class="text-sm">Monitorea y gestiona tus servicios</p>
          </div>
        </div>
      </div>
    </RouterLink>
    <div class="w-[600px] flex flex-row justify-end">
      <RouterLink v-if="!matchesWithCurrentRoute('login')" to="/login" data-testid="login-button" class="p-2 rounded-xl bg-orange-200 flex items-center gap-2">
        <FontAwesomeIcon :icon="faUserCircle" class="text-md" />
        <span class="text-md font-medium">Iniciar sesión</span>
      </RouterLink>
    </div>
  </header>
  <main class="flex flex-col items-center justify-center h-[calc(100vh-60px)]">
    <slot />
  </main>
</template>

<style></style>