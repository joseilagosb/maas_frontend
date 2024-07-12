<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

const { login } = useAuthStore()

const router = useRouter()
const { redirected } = router.currentRoute.value.query || ''

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const isErrorVisible = ref(false)

const isDisabledSubmit = computed(() => email.value == '' || password.value == '')

const onSubmit = async () => {
  isSubmitting.value = true

  login(email.value, password.value)
    .then(() => {
      router.push('/')
    })
    .catch((error: Error) => {
      isErrorVisible.value = true
      console.error(error.message)
    })
    .finally(() => {
      isSubmitting.value = false
    })
}

// Eliminamos el query de la url para que no aparezca el flash message al recargar la página
watchEffect(() => {
  router.replace({ path: '/login' })
})
</script>

<template>
  <section
    class="flex flex-col items-center justify-center gap-6 bg-orange-200 py-8 px-8 rounded-2xl shadow-xl"
  >
    <div
      v-if="redirected === 'loggedout' || redirected === 'notloggedin'"
      class="w-full flex flex-col gap-2 bg-yellow-200 p-4 rounded-lg shadow-md"
      data-testid="flash-message"
    >
      <h4 class="text-md text-yellow-800">
        {{
          redirected === 'loggedout'
            ? 'Has cerrado sesión con éxito.'
            : 'Debes iniciar sesión para acceder a esta página.'
        }}
      </h4>
    </div>
    <form class="flex flex-col gap-8 min-w-[500px]" @submit.prevent="onSubmit">
      <input
        id="email"
        class="outline-none text-xl p-2 bg-transparent transform duration-500 border-b-2 select-none placeholder:italic placeholder:text-gray-500 focus-within:border-orange-500 focus:outline-none"
        v-model="email"
        type="email"
        placeholder="Correo electrónico"
        autocomplete="email"
      />
      <input
        id="password"
        class="outline-none text-xl p-2 bg-transparent transform duration-500 border-b-2 select-none placeholder:italic placeholder:text-gray-500 focus-within:border-orange-500 focus:outline-none"
        v-model="password"
        type="password"
        placeholder="Contraseña"
        autocomplete="current-password"
      />
      <div
        v-if="isErrorVisible"
        data-testid="error-message"
        class="flex flex-col gap-2 bg-red-300 p-4 rounded-lg shadow-md"
      >
        <h4 class="text-md text-red-800">Ha ocurrido un error al iniciar sesión.</h4>
        <p class="text-sm text-red-800">
          Comprueba que las credenciales que ingresaste estén correctas.
        </p>
      </div>
      <button
        type="submit"
        class="block w-full select-none rounded-lg bg-orange-300 text-black py-3 px-6 text-center font-sans text-md font-bold uppercase shadow shadow-gray-900/10 transition-all hover:shadow-md hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        :disabled="isDisabledSubmit || isSubmitting"
      >
        Iniciar sesión
      </button>
    </form>
  </section>
</template>

<style></style>
