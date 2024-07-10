<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faWatchmanMonitoring } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faUserCircle } from '@fortawesome/free-regular-svg-icons'
import { faChevronDown, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { watch } from 'vue'

const router = useRouter()
const authStore = useAuthStore()

const isUserMenuDropdownOpen = ref(false)

const toggleUserMenuDropdown = () => {
  isUserMenuDropdownOpen.value = !isUserMenuDropdownOpen.value
}

const matchesWithCurrentRoute = (routeName: string) => {
  return router.currentRoute.value.name === routeName
}

const onClickLogout = () => {
  authStore.logout()
  router.push('/login?redirected=loggedout')
}

</script>

<template>
  <header class="flex justify-between items-center py-4 px-8 bg-orange-100 h-[60px]">
    <div class="w-[600px] flex flex-row justify-start"></div>
    <RouterLink to="/">
      <div
        class="flex items-center gap-4 bg-orange-200 h-[200px] w-[350px] translate-y-[-30px] rounded-full"
      >
        <div
          class="absolute bottom-0 top-[50%] left-0 right-0 flex items-center justify-center gap-4"
        >
          <FontAwesomeIcon :icon="faWatchmanMonitoring" class="text-orange-500 text-6xl" />
          <div class="flex flex-col w-[40%]">
            <h2 class="text-2xl font-bold">MaaS</h2>
            <p class="text-sm">Monitorea y gestiona tus servicios</p>
          </div>
        </div>
      </div>
    </RouterLink>
    <div class="w-[600px] flex flex-row justify-end">
      <div v-if="authStore.isLoggedIn" class="relative">
        <div class="p-2 rounded-xl bg-orange-200 flex items-center gap-2 cursor-pointer select-none" @click="toggleUserMenuDropdown" data-testid="user-selector">
          <FontAwesomeIcon :icon="faUserCircle" class="text-md" />
          <span class="text-md font-medium" data-testid="welcome-message">{{
            authStore.user.name
          }}</span>
          <FontAwesomeIcon :icon="faChevronDown" :class="{ 'transform rotate-180 duration-300': isUserMenuDropdownOpen }" class="text-md" />
        </div>
        <div v-if="isUserMenuDropdownOpen" class="absolute right-0 max-w-[300px] -bottom-[80px] p-2 flex flex-col gap-2 bg-orange-200 rounded-xl" data-testid="user-dropdown">
          <div class="flex items-center justify-end gap-2">
            <FontAwesomeIcon :icon="faEnvelope" class="text-md" />
            <span class="text-md font-medium">{{authStore.user.email}}</span>
          </div>
          <div class="flex items-center justify-end gap-2 text-right cursor-pointer" @click="onClickLogout" data-testid="logout-button">
            <FontAwesomeIcon :icon="faRightFromBracket" class="text-md" />
            <span class="text-md font-medium">Cerrar sesión</span>
          </div>
        </div>
      </div>
      <div v-else class="flex items-center gap-2">
        <RouterLink
          v-if="!matchesWithCurrentRoute('login')"
          to="/login"
          data-testid="login-button"
          class="p-2 rounded-xl bg-orange-200 flex items-center gap-2"
        >
          <FontAwesomeIcon :icon="faUserCircle" class="text-md" />
          <span class="text-md font-medium">Iniciar sesión</span>
        </RouterLink>
      </div>
    </div>
  </header>
  <main class="flex flex-col items-center justify-center h-[calc(100vh-60px)]">
    <slot />
  </main>
</template>

<style></style>
