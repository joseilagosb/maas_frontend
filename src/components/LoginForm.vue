<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)

const isDisabledSubmit = computed(() => email.value == '' || password.value == ''); 

const onSubmit = async () => {
  isSubmitting.value = true

  setTimeout(() => {
    isSubmitting.value = false
    router.push('/')
  }, 2000)
} 
</script>

<template>
  <section class="flex flex-col items-center justify-center bg-orange-200 py-8 px-8 rounded-2xl shadow-xl">
    <form class="flex flex-col gap-8 min-w-[500px]" @submit.prevent="onSubmit">
      <input id="email" data-testid="email" class="outline-none text-xl p-2 bg-transparent transform duration-500 border-b-2
      placeholder:italic placeholder:text-gray-500
      focus-within:border-orange-500 focus:outline-none" v-model="email" type="email" placeholder="Correo electrónico" />
      <input id="password" data-testid="password" class="outline-none text-xl p-2 bg-transparent transform duration-500 border-b-2
      placeholder:italic placeholder:text-gray-500
      focus-within:border-orange-500 focus:outline-none"v-model="password" type="password" placeholder="Contraseña" />
      <button type="submit" class="block w-full select-none rounded-lg bg-orange-300 text-black py-3 px-6 text-center  font-sans text-md font-bold uppercase shadow shadow-gray-900/10 transition-all 
      hover:shadow-md hover:shadow-gray-900/20 
      active:opacity-[0.85] 
      disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      data-testid="submit-button"
      :disabled="isDisabledSubmit || isSubmitting">Iniciar sesión</button>
    </form>
  </section>
</template>

<style scoped></style>