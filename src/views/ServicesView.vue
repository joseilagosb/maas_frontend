<script setup lang="ts">
import { ref, watchEffect } from 'vue'

import { useHomeStore } from '@/stores/home'

import MainLayout from '@/components/layouts/Main.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPersonBooth, faPlus } from '@fortawesome/free-solid-svg-icons'

import type { Service } from '@/types/models'

const homeStore = useHomeStore()
const loading = ref(true)
const isErrorVisible = ref(false)

watchEffect(() => {
  homeStore
    .fetchServices()
    .catch((error) => {
      console.error(error)
      isErrorVisible.value = true
    })
    .finally(() => {
      loading.value = false
    })
})

const onClickService = (service: Service) => {
  console.log(service)
}
</script>

<template>
  <MainLayout>
    <div class="w-full h-[calc(100vh-60px)] flex items-center justify-center">
      <div v-if="loading" class="flex flex-col gap-2 bg-yellow-200 p-4 rounded-lg shadow-md">
        <h4 class="text-md text-yellow-800">Cargando...</h4>
      </div>
      <div
        v-else-if="isErrorVisible"
        data-testid="error-message"
        class="flex flex-col gap-2 bg-red-300 p-4 rounded-lg shadow-md"
      >
        <h4 class="text-md text-red-800">Ha ocurrido un error al cargar los servicios.</h4>
        <p class="text-sm text-red-800">
          Comprueba que la conexión a internet esté activa y vuelve a intentarlo.
        </p>
      </div>
      <div v-else class="flex flex-col gap-4 size-full pt-4">
        <nav class="flex justify-between items-left gap-4 px-2 w-full">
          <div class="flex flex-row items-center gap-4">
            <a
              class="flex items-center gap-4 cursor-pointer px-4 py-2 bg-orange-500 rounded-lg text-white"
            >
              <FontAwesomeIcon :icon="faPersonBooth" class="text-md" />
              <span class="text-md font-medium">Servicios</span>
            </a>
          </div>
          <a
            class="flex items-center gap-4 cursor-pointer px-4 py-2 bg-orange-500 rounded-lg text-white"
          >
            <FontAwesomeIcon :icon="faPlus" class="text-md" />
            <span class="text-md font-medium">Nuevo servicio</span>
          </a>
        </nav>
        <div
          class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 px-2 overflow-y-auto tiny-scrollbar"
        >
          <button
            v-for="service in homeStore.services"
            @click="onClickService(service)"
            :key="service.id"
            class="bg-orange-200 rounded-lg transform duration-300 hover:scale-[101%]"
          >
            <div class="w-full h-[100px] bg-orange-700 rounded-t-lg"></div>
            <h2 class="text-xl font-bold p-2">{{ service.name }}</h2>
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
