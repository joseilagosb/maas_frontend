<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faWatchmanMonitoring } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faUserCircle } from '@fortawesome/free-regular-svg-icons'
import { faChevronDown, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

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
  authStore.logout().catch((error) => {
    console.error(error)
  })
  router.push('/login?redirected=loggedout')
}
</script>

<template>
  <header class="flex justify-between items-center py-4 px-8 bg-orange-300 h-[60px]">
    <div class="w-[600px] flex flex-row justify-start"></div>
    <RouterLink to="/">
      <div
        class="flex items-center gap-4 bg-orange-300 h-[250px] w-[400px] translate-y-[-30px] rounded-full z-3 shadow-2xl">
        <div class="absolute bottom-0 top-[50%] left-0 right-0 flex items-center justify-center gap-4">
          <FontAwesomeIcon :icon="faWatchmanMonitoring" class="text-orange-700 text-8xl" />
          <div class="flex flex-col w-[50%] gap-2">
            <h2 class="text-4xl font-condensed-bold text-center">MaaS</h2>
            <p class="text-md font-regular leading-5 text-center">Monitorea y gestiona tus servicios</p>
          </div>
        </div>
      </div>
    </RouterLink>
    <div class="w-[600px] flex flex-row justify-end">
      <div v-if="authStore.isLoggedIn" class="relative">
        <div class="p-2 bg-orange-600 flex items-center gap-2 cursor-pointer select-none"
          @click="toggleUserMenuDropdown" data-testid="user-selector">
          <FontAwesomeIcon :icon="faUserCircle" class="text-lg text-white" />
          <span class="text-white text-lg font-condensed-medium" data-testid="welcome-message">{{
            authStore.user.name
          }}</span>
          <FontAwesomeIcon :icon="faChevronDown"
            :class="{ 'transform rotate-180 duration-300': isUserMenuDropdownOpen }" class="text-lg text-white" />
        </div>
        <div class="absolute right-0 w-[300px] top-[40px] overflow-hidden">
          <div :class="{ 'translate-y-0': isUserMenuDropdownOpen, '-translate-y-32': !isUserMenuDropdownOpen }"
            class="float-right max-w-[200px] p-2 flex flex-col gap-1 bg-orange-600 transition-transform duration-300"
            data-testid="user-dropdown">
            <div class="flex items-center justify-end gap-2">
              <FontAwesomeIcon :icon="faEnvelope" class="text-lg text-white" />
              <span class="text-xl text-white font-condensed-medium">{{ authStore.user.email }}</span>
            </div>
            <div class="flex items-center justify-end gap-2 text-right cursor-pointer" @click="onClickLogout"
              data-testid="logout-button">
              <FontAwesomeIcon :icon="faRightFromBracket" class="text-lg text-white" />
              <span class="text-xl text-white font-condensed-medium">Cerrar sesión</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex items-center gap-2">
        <RouterLink v-if="!matchesWithCurrentRoute('login')" to="/login" data-testid="login-button"
          class="p-2 rounded-xl bg-orange-200 flex items-center gap-2">
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
